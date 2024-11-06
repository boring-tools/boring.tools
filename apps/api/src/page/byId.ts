import { db, page } from '@boring.tools/database'
import { PageByIdParams, PageOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'
import type { pageApi } from './index'

const route = createRoute({
  method: 'get',
  tags: ['page'],
  description: 'Get a page by id',
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
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerPageById = (api: typeof pageApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
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

    return c.json(PageOutput.parse(mappedResult), 200)
  })
}
