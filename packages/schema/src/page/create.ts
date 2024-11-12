import { z } from '@hono/zod-openapi'

export const PageCreateInput = z
  .object({
    title: z.string().min(3).openapi({
      example: 'My page',
    }),
    description: z.string().optional().nullable().openapi({
      example: '',
    }),
    icon: z.string().optional().nullable().openapi({
      example: 'base64...',
    }),
    changelogIds: z.array(z.string().uuid()),
  })
  .openapi('Page')
