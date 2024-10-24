import { db, page } from '@boring.tools/database'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { PageByIdParams, PageOutput } from '@boring.tools/schema'
import { HTTPException } from 'hono/http-exception'
import { verifyAuthentication } from '../utils/authentication'
import type { pageApi } from './index'

const getRoute = createRoute({
  method: 'get',
  tags: ['page'],
  description: 'Get a page',
  path: '/:id',
  request: {
    params: PageByIdParams,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PageOutput,
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

export function registerPageById(api: typeof pageApi) {
  return api.openapi(getRoute, async (c) => {
    const userId = verifyAuthentication(c)
    const { id } = c.req.valid('param')

    const result = await db.query.page.findFirst({
      where: and(eq(page.id, id), eq(page.userId, userId)),
      with: {
        changelogs: {
          with: {
            changelog: true,
          },
        },
      },
    })

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    const { changelogs, ...rest } = result

    const mappedResult = {
      ...rest,
      changelogs: changelogs.map((log) => log.changelog),
    }

    return c.json(mappedResult, 200)
  })
}