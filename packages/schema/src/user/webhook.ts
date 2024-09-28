import { z } from '@hono/zod-openapi'

export const UserWebhookInput = z.object({
  data: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email_addresses: z.array(
      z.object({
        email_address: z.string(),
        id: z.string(),
        verification: z.object({
          status: z.string(),
        }),
      }),
    ),
    image_url: z.string(),
  }),
  type: z.string(),
})
