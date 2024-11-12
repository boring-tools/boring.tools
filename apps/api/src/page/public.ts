import { changelog_version, db, page } from '@boring.tools/database'
import { PagePublicOutput, PagePublicParams } from '@boring.tools/schema'
import { createRoute } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { endTime, startTime } from 'hono/timing'

import { openApiErrorResponses } from '../utils/openapi'
import { redis } from '../utils/redis'
import type { pageApi } from './index'

const route = createRoute({
  method: 'get',
  tags: ['page'],
  description: 'Get a page by id for public view',
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
      description: 'Get a page by id for public view',
    },
    ...openApiErrorResponses,
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
    const asd = PagePublicOutput.parse(mappedResult)
    return c.json(asd, 200)
  })
}
