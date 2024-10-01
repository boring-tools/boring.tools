import { z } from '@hono/zod-openapi'
import { ChangelogOutput } from './base'

export const ChangelogCreateOutput = ChangelogOutput
export const ChangelogCreateInput = z
  .object({
    title: z.string().min(3, 'Title must contain at least 3 charachters.'),
    description: z.string(),
  })
  .openapi({
    required: ['title', 'userId'],
  })