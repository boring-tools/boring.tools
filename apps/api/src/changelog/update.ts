import { changelog, db } from '@boring.tools/database'
import {
  ChangelogUpdateInput,
  ChangelogUpdateOutput,
} from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import type { changelogApi } from '.'
import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'
import { redis } from '../utils/redis'

export const route = createRoute({
  method: 'put',
  path: '/:id',
  tags: ['changelog'],
  request: {
    body: {
      content: {
        'application/json': { schema: ChangelogUpdateInput },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': { schema: ChangelogUpdateOutput },
      },
      description: 'Return updated changelog',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerChangelogUpdate = (api: typeof changelogApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const id = c.req.param('id')
    const payload: z.infer<typeof ChangelogUpdateInput> = await c.req.json()

    const [result] = await db
      .update(changelog)
      .set({
        ...payload,
      })
      .where(and(eq(changelog.id, id), eq(changelog.userId, userId)))
      .returning()

    if (!result) {
      throw new HTTPException(404, { message: 'Not found' })
    }

    if (result.pageId) {
      redis.del(result.pageId)
    }
    return c.json(ChangelogUpdateOutput.parse(result), 200)
  })
}
