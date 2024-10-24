import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '..'
import type { ContextModule } from '../utils/sentry'
import { registerUserGet } from './get'
import { registerUserWebhook } from './webhook'

export const userApi = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'user',
}

registerUserGet(userApi)
registerUserWebhook(userApi)

export default userApi
