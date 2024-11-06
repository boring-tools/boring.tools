import { z } from '@hono/zod-openapi'
import { PageOutput } from './base'

export const PageListOutput = z.array(PageOutput)
