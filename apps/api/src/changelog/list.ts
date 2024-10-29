import { changelog, db } from '@boring.tools/database'
import { ChangelogListOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

export const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['changelog'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ChangelogListOutput,
        },
      },
      description: 'Return changelogs for current user',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const func = async ({ userId }: { userId: string }) => {
  const result = await db.query.changelog.findMany({
    where: eq(changelog.userId, userId),
    with: {
      versions: true,
      commits: {
        columns: { id: true },
      },
    },
    orderBy: (changelog, { asc }) => [asc(changelog.createdAt)],
  })

  return result.map((changelog) => {
    const { versions, commits, ...rest } = changelog
    return {
      ...rest,
      computed: {
        versionCount: versions.length,
        commitCount: commits.length,
      },
    }
  })
}

export default {
  route,
  func,
}
