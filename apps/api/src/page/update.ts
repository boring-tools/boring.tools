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
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'
import { redis } from '../utils/redis'
import type { pageApi } from './index'

const route = createRoute({
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
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerPageUpdate = (api: typeof pageApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const { id } = c.req.valid('param')

    const { changelogIds, ...rest }: z.infer<typeof PageUpdateInput> =
      await c.req.json()

    const [result] = await db
      .update(page)
      .set({
        ...rest,
        userId,
      })
      .where(and(eq(page.userId, userId), eq(page.id, id)))
      .returning()

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    // TODO: implement transaction
    if (changelogIds) {
      if (changelogIds.length === 0) {
        await db
          .delete(changelogs_to_pages)
          .where(eq(changelogs_to_pages.pageId, result.id))
      }
      if (changelogIds?.length >= 1) {
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
    }

    redis.del(id)

    return c.json(PageOutput.parse(result), 200)
  })
}
