import { changelog, db } from '@boring.tools/database'
import { GeneralOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

export const route = createRoute({
  method: 'delete',
  path: '/:id',
  tags: ['changelog'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GeneralOutput,
        },
      },
      description: 'Removes a changelog by id',
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
  const result = await db
    .delete(changelog)
    .where(and(eq(changelog.userId, userId), eq(changelog.id, id)))
    .returning()

  if (!result) {
    throw new HTTPException(404, { message: 'Not found' })
  }

  return result
}

export default {
  route,
  func,
}
