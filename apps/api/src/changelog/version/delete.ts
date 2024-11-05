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
import { redis } from '../../utils/redis'

export const remove = createRoute({
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
    404: {
      content: {
        'application/json': {
          schema: GeneralOutput,
        },
      },
      description: 'Version not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const removeFunc = async ({
  userId,
  id,
}: {
  userId: string
  id: string
}) => {
  const changelogResult = await db.query.changelog.findMany({
    where: and(eq(changelog.userId, userId)),
    with: {
      versions: {
        where: eq(changelog_version.id, id),
      },
    },
  })

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

  return db
    .delete(changelog_version)
    .where(and(eq(changelog_version.id, id)))
    .returning()
}
