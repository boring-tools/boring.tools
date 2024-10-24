import { z } from '@hono/zod-openapi'
import { PageOutput } from '../page'
import { ChangelogOutput } from './base'

export const ChangelogListOutput = z.array(
  ChangelogOutput.extend({
    pages: z.array(PageOutput).optional(),
  }),
)
