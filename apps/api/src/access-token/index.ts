import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '..'
import type { ContextModule } from '../utils/sentry'
import { registerAccessTokenCreate } from './create'
import { registerAccessTokenDelete } from './delete'
import { registerAccessTokenList } from './list'

export const accessTokenApi = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'access-token',
}

registerAccessTokenCreate(accessTokenApi)
registerAccessTokenList(accessTokenApi)
registerAccessTokenDelete(accessTokenApi)
