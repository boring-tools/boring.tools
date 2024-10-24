import { z } from '@hono/zod-openapi'

export const PageOutput = z
  .object({
    id: z.string().uuid().openapi({
      example: '',
    }),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  })
  .openapi('Page')