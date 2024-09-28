import { type UserSelect, db, user as userDb } from '@boring.tools/database'
import { UserOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

export const route = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': { schema: UserOutput },
      },
      description: 'Return user',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const func = async ({ user }: { user: UserSelect }) => {
  const result = await db.query.user.findFirst({
    where: eq(userDb.id, user.id),
  })

  if (!result) {
    throw new Error('User not found')
  }

  return result
}

export default {
  route,
  func,
}
