import { db, user as userDb } from '@boring.tools/database'
import { UserOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import type { userApi } from '.'
import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'

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
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerUserGet = (api: typeof userApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const result = await db.query.user.findFirst({
      where: eq(userDb.id, userId),
    })

    if (!result) {
      throw new Error('User not found')
    }

    return c.json(UserOutput.parse(result), 200)
  })
}
