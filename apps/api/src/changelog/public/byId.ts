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

export const func = async ({ id }: { id: string }) => {
  const result = await db.query.changelog.findFirst({
    where: and(eq(changelog.id, id)),
    with: {
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

  const { userId, createdAt, ...rest } = result
  return rest
}

export default {
  route,
  func,
}