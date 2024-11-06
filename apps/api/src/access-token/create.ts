import crypto from 'node:crypto'
import { access_token, db } from '@boring.tools/database'
import { AccessTokenCreateInput, AccessTokenOutput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

import type { accessTokenApi } from '.'
import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'

export const route = createRoute({
  method: 'post',
  path: '/',
  tags: ['access-token'],
  request: {
    body: {
      content: {
        'application/json': { schema: AccessTokenCreateInput },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': { schema: AccessTokenOutput },
      },
      description: 'Commits created',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerAccessTokenCreate = (api: typeof accessTokenApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)

    const data: z.infer<typeof AccessTokenCreateInput> = await c.req.json()
    const token = crypto.randomBytes(20).toString('hex')

    const [result] = await db
      .insert(access_token)
      .values({
        ...data,
        userId,
        token: `bt_${token}`,
      })
      .returning()

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json(AccessTokenOutput.parse(result), 201)
  })
}
