import { changelog, changelog_commit, db } from '@boring.tools/database'
import { CommitListOutput, CommitListParams } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { and, eq, isNotNull, isNull } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { P, match } from 'ts-pattern'

import type { changelogCommitApi } from '.'
import { verifyAuthentication } from '../../utils/authentication'
import { openApiErrorResponses, openApiSecurity } from '../../utils/openapi'

const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['commit'],
  request: {
    query: CommitListParams,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CommitListOutput,
        },
      },
      description: 'Return version by id',
    },
    ...openApiErrorResponses,
  },
  ...openApiSecurity,
})

export const registerCommitList = (api: typeof changelogCommitApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const { changelogId, limit, offset, hasVersion } = c.req.valid('query')
    const result = await db.query.changelog.findFirst({
      where: and(eq(changelog.userId, userId), eq(changelog.id, changelogId)),
    })

    if (!result) {
      throw new HTTPException(404, { message: 'Changelog not found' })
    }

    const where = match({ changelogId, hasVersion })
      .with(
        {
          changelogId: P.select('changelogId'),
          hasVersion: P.when((hasVersion) => hasVersion === true),
        },
        ({ changelogId }) =>
          and(
            eq(changelog_commit.changelogId, changelogId),
            isNotNull(changelog_commit.versionId),
          ),
      )
      .with(
        {
          changelogId: P.select('changelogId'),
          hasVersion: P.when((hasVersion) => hasVersion === false),
        },
        ({ changelogId }) =>
          and(
            eq(changelog_commit.changelogId, changelogId),
            isNull(changelog_commit.versionId),
          ),
      )
      .otherwise(() => eq(changelog_commit.changelogId, changelogId))

    const commits = await db.query.changelog_commit.findMany({
      where,
      limit: Number(limit) ?? 10,
      offset: Number(offset) ?? 0,
      orderBy: (_, { desc }) => [desc(changelog_commit.createdAt)],
    })

    if (!commits) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json(CommitListOutput.parse(commits), 200)
  })
}
