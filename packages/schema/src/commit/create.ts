import { z } from '@hono/zod-openapi'
import { CommitOutput } from './base'

export const CommitCreateOutput = CommitOutput
export const CommitCreateInput = z
  .array(
    z.object({
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
      commiter: z
        .object({
          name: z.string(),
          email: z.string().email(),
          date: z.string(),
        })
        .optional(),
      body: z.string().optional(),
    }),
  )
  .openapi({
    required: ['changelogId', 'commit', 'subject'],
  })
