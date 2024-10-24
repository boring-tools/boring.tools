import { changelogs_to_pages, db, page } from '@boring.tools/database'
import { createRoute, type z } from '@hono/zod-openapi'

import { PageCreateInput, PageOutput } from '@boring.tools/schema'
import { HTTPException } from 'hono/http-exception'
import { verifyAuthentication } from '../utils/authentication'
import type { pageApi } from './index'

const getRoute = createRoute({
  method: 'post',
  tags: ['page'],
  description: 'Create a page',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': { schema: PageCreateInput },
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

export function registerPageCreate(api: typeof pageApi) {
  return api.openapi(getRoute, async (c) => {
    const userId = verifyAuthentication(c)

    const { changelogIds, ...rest }: z.infer<typeof PageCreateInput> =
      await c.req.json()

    const [result] = await db
      .insert(page)
      .values({
        ...rest,
        userId: userId,
      })
      .returning()

    // TODO: implement transaction
    if (changelogIds) {
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
