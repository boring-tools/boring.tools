import { changelog, changelog_version, db } from '@boring.tools/database'
import { VersionByIdParams, VersionOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'

import { HTTPException } from 'hono/http-exception'
import type changelogVersionApi from '.'
import { verifyAuthentication } from '../../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../../utils/openapi'

export const byId = createRoute({
  method: 'get',
  path: '/:id',
  tags: ['version'],
  request: {
    params: VersionByIdParams,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: VersionOutput,
        },
      },
      description: 'Return version by id',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerVersionById = (api: typeof changelogVersionApi) => {
  return api.openapi(byId, async (c) => {
    const userId = await verifyAuthentication(c)
    const { id } = c.req.valid('param')

    const versionResult = await db.query.changelog_version.findFirst({
      where: eq(changelog_version.id, id),
      with: {
        commits: true,
      },
    })

    if (!versionResult) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    if (!versionResult.changelogId) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    const changelogResult = await db.query.changelog.findMany({
      where: and(eq(changelog.userId, userId)),
      columns: {
        id: true,
      },
    })

    const changelogIds = changelogResult.map((cl) => cl.id)

    if (!changelogIds.includes(versionResult.changelogId)) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json(VersionOutput.parse(versionResult), 200)
  })
}
