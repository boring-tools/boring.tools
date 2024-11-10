import { z } from '@hono/zod-openapi'
import { CommitOutput } from '../commit'

export const VersionOutput = z
  .object({
    id: z.string().uuid().openapi({
      example: '9f00f912-f687-42ef-84d7-efde48ca11ef',
    }),
    changelogId: z.string().uuid().openapi({
      example: '8f00f912-f687-42ef-84d7-efde48ca11ef',
    }),
    version: z.string().openapi({
      example: '1.0.0',
    }),
    markdown: z.string().openapi({
      example: '### Changelog\n\n- Added a new feature',
    }),
    releasedAt: z.date().optional().nullable().openapi({
      example: '2024-01-01T00:00:00.000Z',
    }),
    status: z.enum(['draft', 'review', 'published']).default('draft').openapi({
      example: 'draft',
    }),
    commits: z.array(CommitOutput).optional(),
  })
  .openapi('Version')
