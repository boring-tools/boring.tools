import { changelog, changelog_commit, db } from '@boring.tools/database'
import { CommitCreateInput, CommitCreateOutput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

import type { changelogCommitApi } from '.'
import { verifyAuthentication } from '../../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../../utils/openapi'

export const route = createRoute({
  method: 'post',
  path: '/',
  tags: ['commit'],
  request: {
    body: {
      content: {
        'application/json': { schema: CommitCreateInput },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': { schema: CommitCreateOutput },
      },
      description: 'Commits created',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerCommitCreate = (api: typeof changelogCommitApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)

    const data: z.infer<typeof CommitCreateInput> = await c.req.json()
    const changelogResult = await db.query.changelog.findFirst({
      where: and(
        eq(changelog.id, data[0].changelogId),
        eq(changelog.userId, userId),
      ),
    })

    if (!changelogResult) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    const mappedData = data.map((entry) => ({
      ...entry,
      createdAt: new Date(entry.author.date),
    }))

    const [result] = await db
      .insert(changelog_commit)
      .values(mappedData)
      .onConflictDoNothing()
      .returning()

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json(CommitCreateOutput.parse(result), 201)
  })
}
