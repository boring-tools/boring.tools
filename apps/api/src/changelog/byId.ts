import { changelog, db } from '@boring.tools/database'
import { ChangelogByIdParams, ChangelogOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import type { changelogApi } from '.'
import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'

export const route = createRoute({
  method: 'get',
  path: '/:id',
  tags: ['changelog'],
  request: {
    params: ChangelogByIdParams,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ChangelogOutput,
        },
      },
      description: 'Return changelog by id',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerChangelogById = (api: typeof changelogApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const { id } = c.req.valid('param')

    const result = await db.query.changelog.findFirst({
      where: and(eq(changelog.userId, userId), eq(changelog.id, id)),
      with: {
        pages: {
          with: {
            page: true,
          },
        },
        versions: {
          orderBy: (changelog_version, { desc }) => [
            desc(changelog_version.createdAt),
          ],
        },
      },
    })

    if (!result) {
      throw new HTTPException(404, { message: 'Not found' })
    }
    return c.json(ChangelogOutput.parse(result), 200)
  })
}
