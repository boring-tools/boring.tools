import { changelog_version, db, page } from '@boring.tools/database'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { endTime, setMetric, startTime } from 'hono/timing'

import { PagePublicOutput, PagePublicParams } from '@boring.tools/schema'
import { HTTPException } from 'hono/http-exception'

import { redis } from '../utils/redis'
import type { pageApi } from './index'

const route = createRoute({
  method: 'get',
  tags: ['page'],
  description: 'Get a page',
  path: '/:id/public',
  request: {
    params: PagePublicParams,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PagePublicOutput,
        },
      },
      description: 'Return changelog by id',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const registerPagePublic = (api: typeof pageApi) => {
  return api.openapi(route, async (c) => {
    const { id } = c.req.valid('param')
    const cache = await redis.get(id)

    if (cache) {
      c.header('Cache-Control', 'public, max-age=86400')
      c.header('X-Cache', 'HIT')
      return c.json(JSON.parse(cache), 200)
    }

    startTime(c, 'database')

    const result = await db.query.page.findFirst({
      where: eq(page.id, id),
      columns: {
        title: true,
        description: true,
        icon: true,
      },
      with: {
        changelogs: {
          with: {
            changelog: {
              columns: {
                title: true,
                description: true,
              },
              with: {
                versions: {
                  where: eq(changelog_version.status, 'published'),
                  orderBy: (changelog_version, { desc }) => [
                    desc(changelog_version.createdAt),
                  ],
                  columns: {
                    markdown: true,
                    version: true,
                    releasedAt: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    endTime(c, 'database')

    if (!result) {
      throw new HTTPException(404, { message: 'Not Found' })
    }

    const { changelogs, ...rest } = result

    const mappedResult = {
      ...rest,
      changelogs: changelogs.map((log) => log.changelog),
    }

    redis.set(id, JSON.stringify(mappedResult), { EX: 60 })
    return c.json(mappedResult, 200)
  })
}
