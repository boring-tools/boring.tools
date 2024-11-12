import { changelogs_to_pages, db, page } from '@boring.tools/database'
import { PageCreateInput, PageOutput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'
import type { pageApi } from './index'

const route = createRoute({
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
    201: {
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

export const registerPageCreate = (api: typeof pageApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)

    const { changelogIds, ...rest }: z.infer<typeof PageCreateInput> =
      await c.req.json()

    const [result] = await db
      .insert(page)
      .values({
        ...rest,
        userId: userId,
      })
      .returning()

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    // TODO: implement transaction
    if (changelogIds.length > 0) {
      await db.insert(changelogs_to_pages).values(
        changelogIds.map((changelogId) => ({
          changelogId,
          pageId: result.id,
        })),
      )
    }

    return c.json(PageOutput.parse(result), 201)
  })
}
