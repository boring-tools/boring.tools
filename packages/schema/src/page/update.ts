import { z } from '@hono/zod-openapi'
import { PageOutput } from './base'

export const PageUpdateOutput = PageOutput
export const PageUpdateInput = z
  .object({
    title: z.string().min(3).optional().openapi({
      example: 'My page',
    }),
    description: z.string().nullable().optional().openapi({
      example: '',
    }),
    icon: z.string().optional().nullable().openapi({
      example: 'base64...',
    }),
    changelogIds: z.array(z.string().uuid()).optional(),
  })
  .openapi('Page')
export const PageUpdateParams = z
  .object({
    id: z.string().uuid(),
  })
  .openapi({
    required: ['id'],
  })
