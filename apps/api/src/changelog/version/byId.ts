import { changelog, changelog_version, db } from '@boring.tools/database'
import { VersionByIdParams, VersionOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

export const byId = createRoute({
  method: 'get',
  path: '/:id',
  tags: ['version'],
  request: {
    params: VersionByIdParams,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: VersionOutput,
        },
      },
      description: 'Return version by id',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const byIdFunc = async ({
  userId,
  id,
}: {
  userId: string
  id: string
}) => {
  const versionResult = await db.query.changelog_version.findFirst({
    where: eq(changelog_version.id, id),
    with: {
      commits: true,
    },
  })

  if (!versionResult) {
    return null
  }

  if (!versionResult.changelogId) {
    return null
  }

  const changelogResult = await db.query.changelog.findMany({
    where: and(eq(changelog.userId, userId)),
    columns: {
      id: true,
    },
  })

  const changelogIds = changelogResult.map((cl) => cl.id)

  if (!changelogIds.includes(versionResult.changelogId)) {
    return null
  }

  return versionResult
}
