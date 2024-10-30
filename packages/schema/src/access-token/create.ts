import { z } from '@hono/zod-openapi'

export const AccessTokenCreateInput = z
  .object({
    name: z.string(),
  })
  .openapi('Access Token')
