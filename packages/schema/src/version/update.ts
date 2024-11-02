import { z } from '@hono/zod-openapi'
import { VersionOutput } from './base'

export const VersionUpdateOutput = VersionOutput
export const VersionUpdateInput = z
  .object({
    version: z.string(),
    markdown: z.string().optional(),
    status: z
      .enum(['draft', 'review', 'published'])
      .default('draft')
      .optional(),
    releasedAt: z.date().or(z.string()).optional().nullable(),
  })
  .openapi({})
export const VersionUpdateParams = z
  .object({
    id: z.string().uuid(),
  })
  .openapi({
    required: ['id'],
  })
