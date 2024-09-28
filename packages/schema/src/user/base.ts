import { z } from '@hono/zod-openapi'

export const UserOutput = z.object({
  id: z.string().openapi({
    example: 'user_2metCkqOhUhHN1jEhLyh8wMODu7',
  }),
  name: z.string(),
  email: z.string().email(),
})
