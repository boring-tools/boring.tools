import { db, user as userDb } from '@boring.tools/database'
import { UserOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import type { userApi } from '.'

const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['user'],
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

export const registerUserGet = (api: typeof userApi) => {
  return api.openapi(route, async (c) => {
    const user = c.get('user')
    const result = await db.query.user.findFirst({
      where: eq(userDb.id, user.id),
    })

    if (!result) {
      throw new Error('User not found')
    }

    return c.json(result, 200)
  })
}
