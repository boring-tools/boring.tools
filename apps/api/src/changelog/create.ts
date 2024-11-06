import { changelog, db } from '@boring.tools/database'
import {
  ChangelogCreateInput,
  ChangelogCreateOutput,
} from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'

import type { changelogApi } from '.'
import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'

export const route = createRoute({
  method: 'post',
  path: '/',
  tags: ['changelog'],
  request: {
    body: {
      content: {
        'application/json': { schema: ChangelogCreateInput },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': { schema: ChangelogCreateOutput },
      },
      description: 'Return created changelog',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerChangelogCreate = (api: typeof changelogApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const payload: z.infer<typeof ChangelogCreateInput> = await c.req.json()

    const [result] = await db
      .insert(changelog)
      .values({
        ...payload,
        userId: userId,
      })
      .returning()

    return c.json(ChangelogCreateOutput.parse(result), 201)
  })
}
