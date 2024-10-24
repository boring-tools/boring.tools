import { changelogs_to_pages, db, page } from '@boring.tools/database'
import { createRoute, type z } from '@hono/zod-openapi'

import {
  PageOutput,
  PageUpdateInput,
  PageUpdateParams,
} from '@boring.tools/schema'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { verifyAuthentication } from '../utils/authentication'
import type { pageApi } from './index'

const getRoute = createRoute({
  method: 'put',
  tags: ['page'],
  description: 'Update a page',
  path: '/:id',
  request: {
    params: PageUpdateParams,
    body: {
      content: {
        'application/json': { schema: PageUpdateInput },
      },
    },
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

export function registerPageUpdate(api: typeof pageApi) {
  return api.openapi(getRoute, async (c) => {
    const userId = verifyAuthentication(c)
    const { id } = c.req.valid('param')

    const { changelogIds, ...rest }: z.infer<typeof PageUpdateInput> =
      await c.req.json()

    const [result] = await db
      .update(page)
      .set({
        ...rest,
        userId: userId,
      })
      .where(and(eq(page.userId, userId), eq(page.id, id)))
      .returning()

    // TODO: implement transaction
    if (changelogIds) {
      await db
        .delete(changelogs_to_pages)
        .where(eq(changelogs_to_pages.pageId, result.id))
      await db.insert(changelogs_to_pages).values(
        changelogIds.map((changelogId) => ({
          changelogId,
          pageId: result.id,
        })),
      )
    }
    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json(result, 200)
  })
}
