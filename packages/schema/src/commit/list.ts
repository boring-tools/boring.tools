import { z } from '@hono/zod-openapi'
import { VersionOutput } from './base'

export const VersionListOutput = z.array(VersionOutput)
