import { db, page } from '@boring.tools/database'
import { createRoute, z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { PageListOutput } from '@boring.tools/schema'
import { HTTPException } from 'hono/http-exception'
import { verifyAuthentication } from '../utils/authentication'
import type { pageApi } from './index'

const route = createRoute({
  method: 'get',
  tags: ['page'],
  description: 'Get a page list',
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
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export function registerPageList(api: typeof pageApi) {
  return api.openapi(route, async (c) => {
    const userId = verifyAuthentication(c)

    const result = await db.query.page.findMany({
      where: and(eq(page.userId, userId)),
    })

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json(result, 200)
  })
}
