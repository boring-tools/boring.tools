import { changelog, db, page } from '@boring.tools/database'
import { StatisticOutput } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import type { statisticApi } from '.'
import { verifyAuthentication } from '../utils/authentication'

const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['statistic'],
  responses: {
    200: {
      content: {
        'application/json': { schema: StatisticOutput },
      },
      description: 'Return user',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const registerStatisticGet = (api: typeof statisticApi) => {
  return api.openapi(route, async (c) => {
    const userId = await verifyAuthentication(c)
    const pageResult = await db.query.page.findMany({
      where: eq(page.userId, userId),
    })
    const result = await db.query.changelog.findMany({
      where: eq(changelog.userId, userId),
      with: {
        commits: {
          columns: {
            id: true,
            versionId: true,
          },
        },
        versions: {
          columns: {
            id: true,
            status: true,
          },
        },
      },
    })

    const changelog_total = result.length
    const version_total = result.reduce(
      (acc, log) => acc + log.versions.length,
      0,
    )
    const version_published = result.reduce(
      (acc, log) =>
        acc +
        log.versions.filter((version) => version.status === 'published').length,
      0,
    )
    const version_review = result.reduce(
      (acc, log) =>
        acc +
        log.versions.filter((version) => version.status === 'review').length,
      0,
    )
    const version_draft = result.reduce(
      (acc, log) =>
        acc +
        log.versions.filter((version) => version.status === 'draft').length,
      0,
    )

    const commit_total = result.reduce(
      (acc, log) => acc + log.commits.length,
      0,
    )
    const commit_unassigned = result.reduce(
      (acc, log) =>
        acc + log.commits.filter((commit) => !commit.versionId).length,
      0,
    )
    const commit_assigned = result.reduce(
      (acc, log) =>
        acc + log.commits.filter((commit) => commit.versionId).length,
      0,
    )

    const mappedData = {
      changelog: {
        total: changelog_total,
        versions: {
          total: version_total,
          published: version_published,
          review: version_review,
          draft: version_draft,
        },
        commits: {
          total: commit_total,
          unassigned: commit_unassigned,
          assigned: commit_assigned,
        },
      },
      page: {
        total: pageResult.length,
      },
    }

    return c.json(mappedData, 200)
  })
}
