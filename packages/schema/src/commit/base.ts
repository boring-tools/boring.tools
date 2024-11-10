import { z } from '@hono/zod-openapi'

export const CommitOutput = z
  .object({
    id: z.string().uuid().openapi({
      example: '9f00f912-f687-42ef-84d7-efde48ca11ef',
    }),
    changelogId: z.string().uuid().openapi({
      example: '8f00f912-f687-42ef-84d7-efde48ca11ef',
    }),
    commit: z.string().openapi({
      example: 'abc123',
    }),
    parent: z.string().optional().openapi({
      example: 'abc122',
    }),
    subject: z.string(),
    author: z.object({
      name: z.string(),
      email: z.string().email(),
      date: z.string(),
    }),
    commiter: z.object({
      name: z.string(),
      email: z.string().email(),
      date: z.string(),
    }),
    body: z.string().optional().nullable(),
  })
  .openapi('Commit')
