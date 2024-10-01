import { z } from '@hono/zod-openapi'
import { ChangelogOutput } from './base'
import { ChangelogCreateInput } from './create'

export const ChangelogUpdateOutput = ChangelogOutput
export const ChangelogUpdateInput = ChangelogCreateInput
export const ChangelogUpdateParams = z
  .object({
    id: z.string().uuid(),
  })
  .openapi({
    required: ['id'],
  })
