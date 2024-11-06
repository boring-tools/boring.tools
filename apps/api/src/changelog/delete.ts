import { changelog, db } from '@boring.tools/database'
import { GeneralOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import type { changelogApi } from '.'
import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'

export const route = createRoute({
  method: 'delete',
  path: '/:id',
  tags: ['changelog'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GeneralOutput,
        },
      },
      description: 'Removes a changelog by id',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerChangelogDelete = async (api: typeof changelogApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const id = c.req.param('id')

    const [result] = await db
      .delete(changelog)
      .where(and(eq(changelog.userId, userId), eq(changelog.id, id)))
      .returning()

    if (!result) {
      throw new HTTPException(404, { message: 'Not found' })
    }

    return c.json(GeneralOutput.parse(result), 200)
  })
}
