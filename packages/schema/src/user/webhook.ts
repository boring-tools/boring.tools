import { z } from '@hono/zod-openapi'

export const UserWebhookInput = z
  .object({
    data: z.object({
      id: z.string().openapi({
        example: 'user_2metCkqOhUhHN1jEhLyh8wMODu7',
      }),
      first_name: z.string().openapi({
        example: 'Jane',
      }),
      last_name: z.string().openapi({
        example: 'Doe',
      }),
      email_addresses: z.array(
        z.object({
          email_address: z.string().openapi({
            example: 'jane@doe.com',
          }),
        }),
      ),
      image_url: z.string().openapi({
        example: 'https://example.com/image.png',
      }),
    }),
    type: z.string().openapi({
      examples: ['user.created', 'user.updated'],
    }),
  })
  .openapi('User')
