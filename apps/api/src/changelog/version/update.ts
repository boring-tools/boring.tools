import { changelog, changelog_version, db } from '@boring.tools/database'
import { VersionUpdateInput, VersionUpdateOutput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import type changelogVersionApi from '.'
import { verifyAuthentication } from '../../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../../utils/openapi'
import { redis } from '../../utils/redis'

export const route = createRoute({
  method: 'put',
  path: '/:id',
  tags: ['version'],
  request: {
    body: {
      content: {
        'application/json': { schema: VersionUpdateInput },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': { schema: VersionUpdateOutput },
      },
      description: 'Return updated version',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerVersionUpdate = (api: typeof changelogVersionApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const id = c.req.param('id')
    const payload: z.infer<typeof VersionUpdateInput> = await c.req.json()

    const changelogResult = await db.query.changelog.findMany({
      where: and(eq(changelog.userId, userId)),
      with: {
        versions: {
          where: eq(changelog_version.id, id),
        },
      },
    })

    if (!changelogResult) {
      throw new HTTPException(404, {
        message: 'Version not found',
      })
    }

    const findChangelog = changelogResult.find((change) =>
      change.versions.find((ver) => ver.id === id),
    )

    if (!findChangelog?.versions.length) {
      throw new HTTPException(404, {
        message: 'Version not found',
      })
    }

    const [versionUpdateResult] = await db
      .update(changelog_version)
      .set({
        version: payload.version,
        status: payload.status,
        markdown: payload.markdown,
        releasedAt: payload.releasedAt ? new Date(payload.releasedAt) : null,
      })
      .where(and(eq(changelog_version.id, id)))
      .returning()

    if (findChangelog.pageId) {
      redis.del(findChangelog.pageId)
    }

    return c.json(VersionUpdateOutput.parse(versionUpdateResult), 200)
  })
}
