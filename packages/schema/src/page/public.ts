import { z } from '@hono/zod-openapi'

export const PagePublicOutput = z.object({
  title: z.string(),
  description: z.string().nullable(),
  icon: z.string(),
  changelogs: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        versions: z.array(
          z.object({
            markdown: z.string(),
            version: z.string(),
            releasedAt: z.date(),
          }),
        ),
      }),
    )
    .optional(),
})

export const PagePublicParams = z.object({
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
