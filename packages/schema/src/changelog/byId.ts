import { z } from '@hono/zod-openapi'
import { ChangelogOutput } from './base'

export const ChangelogListOutput = z.array(ChangelogOutput)
