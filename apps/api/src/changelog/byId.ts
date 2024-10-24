import { changelog, db } from '@boring.tools/database'
import { ChangelogByIdParams, ChangelogOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

export const route = createRoute({
  method: 'get',
  path: '/:id',
  request: {
    params: ChangelogByIdParams,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ChangelogOutput,
        },
      },
      description: 'Return changelog by id',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const func = async ({ userId, id }: { userId: string; id: string }) => {
  const result = await db.query.changelog.findFirst({
    where: and(eq(changelog.userId, userId), eq(changelog.id, id)),
    with: {
      pages: {
        with: {
          page: true,
        },
      },
      versions: {
        orderBy: (changelog_version, { desc }) => [
          desc(changelog_version.createdAt),
        ],
      },
    },
  })

  if (!result) {
    throw new HTTPException(404, { message: 'Not found' })
  }
  return result
}

export default {
  route,
  func,
}
