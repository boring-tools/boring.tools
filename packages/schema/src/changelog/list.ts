import { z } from '@hono/zod-openapi'

export const ChangelogByIdParams = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: 'a5ed5965-0506-44e6-aaec-0465ff9fe092',
    }),
})
