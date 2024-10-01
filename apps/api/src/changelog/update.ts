import { changelog, db } from '@boring.tools/database'
import {
  ChangelogUpdateInput,
  ChangelogUpdateOutput,
} from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

export const route = createRoute({
  method: 'put',
  path: '/:id',
  request: {
    body: {
      content: {
        'application/json': { schema: ChangelogUpdateInput },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': { schema: ChangelogUpdateOutput },
      },
      description: 'Return updated changelog',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const func = async ({
  userId,
  payload,
  id,
}: {
  userId: string
  payload: z.infer<typeof ChangelogUpdateInput>
  id: string
}) => {
  const result = await db
    .update(changelog)
    .set({
      ...payload,
    })
    .where(and(eq(changelog.id, id), eq(changelog.userId, userId)))
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
