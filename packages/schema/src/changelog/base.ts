import { z } from '@hono/zod-openapi'

export const ChangelogOutput = z
  .object({
    id: z.string().uuid().openapi({
      example: '9f00f912-f687-42ef-84d7-efde48ca11ef',
    }),
    title: z.string().min(3).openapi({
      example: 'My Changelog',
    }),
    description: z.string().openapi({
      example: 'This is a changelog',
    }),
    versions: z.array(z.object({})).optional(),
    computed: z.object({
      versionCount: z.number().openapi({
        example: 5,
      }),
      commitCount: z.number().openapi({
        example: 10,
      }),
    }),
  })
  .openapi('Changelog')
