import { access_token, db } from '@boring.tools/database'
import { GeneralOutput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import type { accessTokenApi } from '.'
import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'

export const route = createRoute({
  method: 'delete',
  path: '/:id',
  tags: ['access-token'],
  responses: {
    200: {
      content: {
        'application/json': { schema: GeneralOutput },
      },
      description: 'Removes a access token by id',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerAccessTokenDelete = (api: typeof accessTokenApi) => {
  return api.openapi(route, async (c) => {
    const id = c.req.param('id')
    const userId = await verifyAuthentication(c)

    const [result] = await db
      .delete(access_token)
      .where(and(eq(access_token.userId, userId), eq(access_token.id, id)))
      .returning()

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json(GeneralOutput.parse({ message: 'Access token deleted' }), 200)
  })
}
