import {
  changelog,
  changelog_commit,
  changelog_version,
  db,
} from '@boring.tools/database'
import { GeneralOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type changelogVersionApi from '.'
import { verifyAuthentication } from '../../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../../utils/openapi'
import { redis } from '../../utils/redis'

export const route = createRoute({
  method: 'delete',
  path: '/:id',
  tags: ['version'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GeneralOutput,
        },
      },
      description: 'Removes a version by id',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerVersionDelete = async (
  api: typeof changelogVersionApi,
) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const id = c.req.param('id')

    const changelogResult = await db.query.changelog.findMany({
      where: and(eq(changelog.userId, userId)),
      with: {
        versions: {
          where: eq(changelog_version.id, id),
        },
      },
    })

    if (!changelogResult) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    const findChangelog = changelogResult.find((change) =>
      change.versions.find((ver) => ver.id === id),
    )

    if (!findChangelog?.versions.length) {
      throw new HTTPException(404, {
        message: 'Version not found',
      })
    }

    await db
      .update(changelog_commit)
      .set({ versionId: null })
      .where(eq(changelog_commit.versionId, id))

    if (findChangelog.pageId) {
      redis.del(findChangelog.pageId)
    }

    await db
      .delete(changelog_version)
      .where(and(eq(changelog_version.id, id)))
      .returning()

    return c.json(GeneralOutput.parse({ message: 'Version deleted' }), 200)
  })
}
