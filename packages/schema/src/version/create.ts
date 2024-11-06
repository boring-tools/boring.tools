import { z } from '@hono/zod-openapi'
import { VersionOutput } from './base'

export const VersionCreateOutput = VersionOutput
export const VersionCreateInput = z
  .object({
    changelogId: z.string().uuid(),
    version: z.string(),
    releasedAt: z.date().or(z.string()).optional().nullable(),
    status: z.enum(['draft', 'review', 'published']).default('draft'),
    markdown: z.string(),
    commitIds: z.array(z.string()),
  })
  .openapi({
    required: ['changelogId', 'version', 'markdown', 'releasedAt'],
  })

export const VersionCreateAutoInput = z
  .object({
    version: z.string().optional(),
    changelogId: z.string().uuid(),
  })
  .openapi({
    required: ['changelogId'],
  })
