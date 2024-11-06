import { db, page } from '@boring.tools/database'
import { PageListOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'
import type { pageApi } from './index'

const route = createRoute({
  method: 'get',
  tags: ['page'],
  description: 'Get a list of pages',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PageListOutput,
        },
      },
      description: 'Return changelog by id',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerPageList = (api: typeof pageApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)

    const result = await db.query.page.findMany({
      where: and(eq(page.userId, userId)),
    })

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json(PageListOutput.parse(result), 200)
  })
}
