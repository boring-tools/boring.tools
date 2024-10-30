import { z } from '@hono/zod-openapi'
import { AccessTokenOutput } from './base'

export const AccessTokenListOutput = z.array(AccessTokenOutput)
