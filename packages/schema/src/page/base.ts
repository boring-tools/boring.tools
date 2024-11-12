import { z } from '@hono/zod-openapi'
import { ChangelogOutput } from '../changelog'

export const PageOutput = z
  .object({
    id: z.string().uuid().openapi({
      example: '',
    }),
    title: z.string(),
    description: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    changelogs: z.array(ChangelogOutput).optional(),
  })
  .openapi('Page')
