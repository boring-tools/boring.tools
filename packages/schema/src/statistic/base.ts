import { z } from '@hono/zod-openapi'

export const StatisticOutput = z
  .object({
    changelog: z.object({
      total: z.number(),
      commits: z.object({
        total: z.number(),
        unassigned: z.number(),
        assigned: z.number(),
      }),
      versions: z.object({
        total: z.number(),
        published: z.number(),
        review: z.number(),
        draft: z.number(),
      }),
    }),
    page: z.object({
      total: z.number(),
    }),
  })
  .openapi('Statistic')
