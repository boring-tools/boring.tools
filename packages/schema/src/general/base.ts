import { z } from '@hono/zod-openapi'

export const GeneralOutput = z
  .object({
    message: z.string().optional().openapi({
      example: 'Something',
    }),
  })
  .openapi('General')
