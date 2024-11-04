import { changelog, db } from '@boring.tools/database'
import { AccessTokenListOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type { accessTokenApi } from '.'
import { verifyAuthentication } from '../utils/authentication'

const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['access-token'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AccessTokenListOutput,
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

export const registerAccessTokenList = (api: typeof accessTokenApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const result = await db.query.access_token.findMany({
      where: eq(changelog.userId, userId),
    })

    if (!result) {
      throw new HTTPException(404, { message: 'Access Tokens not found' })
    }

    const mappedData = result.map((at) => ({
      ...at,
      token: at.token.substring(0, 10),
    }))

    return c.json(mappedData, 200)
  })
}
