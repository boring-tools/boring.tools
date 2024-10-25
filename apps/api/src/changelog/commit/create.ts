import { changelog, changelog_commit, db } from '@boring.tools/database'
import { CommitCreateInput, CommitCreateOutput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type { changelogCommitApi } from '.'
import { verifyAuthentication } from '../../utils/authentication'

export const route = createRoute({
  method: 'post',
  path: '/',
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
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const regsiterCommitCreate = (api: typeof changelogCommitApi) => {
  return api.openapi(route, async (c) => {
    const userId = verifyAuthentication(c)

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

    const [result] = await db.insert(changelog_commit).values(data).returning()

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    return c.json(result, 200)
  })
}