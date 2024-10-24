import { z } from '@hono/zod-openapi'
import { ChangelogOutput } from '../changelog'
import { PageOutput } from './base'

export const PageByIdOutput = PageOutput.extend({
  changelogs: z.array(ChangelogOutput),
})

export const PageByIdParams = z.object({
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
