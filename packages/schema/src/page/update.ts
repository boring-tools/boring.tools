import { z } from '@hono/zod-openapi'
import { PageOutput } from './base'
import { PageCreateInput } from './create'

export const PageUpdateOutput = PageOutput
export const PageUpdateInput = PageCreateInput
export const PageUpdateParams = z
  .object({
    id: z.string().uuid(),
  })
  .openapi({
    required: ['id'],
  })
