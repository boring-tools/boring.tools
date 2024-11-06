import { changelog, db } from '@boring.tools/database'
import { ChangelogListOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'

import type { changelogApi } from '.'
import { verifyAuthentication } from '../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../utils/openapi'

export const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['changelog'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ChangelogListOutput,
        },
      },
      description: 'Return changelogs for current user',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerChangelogList = (api: typeof changelogApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)

    const result = await db.query.changelog.findMany({
      where: eq(changelog.userId, userId),
      with: {
        versions: true,
        commits: {
          columns: { id: true },
        },
      },
      orderBy: (changelog, { asc }) => [asc(changelog.createdAt)],
    })

    const mappedData = result.map((changelog) => {
      const { versions, commits, ...rest } = changelog
      return {
        ...rest,
        computed: {
          versionCount: versions.length,
          commitCount: commits.length,
        },
      }
    })

    return c.json(ChangelogListOutput.parse(mappedData), 200)
  })
}
