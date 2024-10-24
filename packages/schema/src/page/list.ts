import { z } from '@hono/zod-openapi'
import { ChangelogOutput } from '../changelog'
import { PageOutput } from './base'

export const PageListOutput = z.array(
  PageOutput.extend({
    changelogs: z.array(ChangelogOutput),
  }),
)
