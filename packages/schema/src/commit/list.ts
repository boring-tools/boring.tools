import { z } from '@hono/zod-openapi'
import { CommitOutput } from './base'

export const CommitListOutput = z.array(CommitOutput)
export const CommitListParams = z.object({
  changelogId: z
    .string()
    .uuid()
    .openapi({
      param: {
        name: 'changelogId',
        in: 'query',
      },
      example: 'a5ed5965-0506-44e6-aaec-0465ff9fe092',
    }),
  limit: z.number().or(z.string()).optional(),
  offset: z.number().or(z.string()).optional(),
  hasVersion: z.boolean().default(false),
})
