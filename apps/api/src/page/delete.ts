import { db, page } from '@boring.tools/database'
import { GeneralOutput, PageByIdParams } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import type { pageApi } from '.'
import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'

const route = createRoute({
  method: 'delete',
  tags: ['page'],
  path: '/:id',
  request: {
    params: PageByIdParams,
  },

  responses: {
    200: {
      content: {
        'application/json': {
          schema: GeneralOutput,
        },
      },
      description: 'Removes a changelog by id',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerPageDelete = (api: typeof pageApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const { id } = c.req.valid('param')

    const result = await db
      .delete(page)
      .where(and(eq(page.userId, userId), eq(page.id, id)))
      .returning()

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json({}, 200)
  })
}
