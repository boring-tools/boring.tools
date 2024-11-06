import { z } from '@hono/zod-openapi'

export const AccessTokenOutput = z
  .object({
    id: z.string().openapi({
      example: 'user_2metCkqOhUhHN1jEhLyh8wMODu7',
    }),
    token: z.string().optional(),
    name: z.string(),
    lastUsedOn: z.string().or(z.date()).optional().nullable(),
  })
  .openapi('Access Token')
