import { OpenAPIHono } from '@hono/zod-openapi'
import { timing } from 'hono/timing'
import type { Variables } from '..'
import { handleZodError } from '../utils/errors'
import type { ContextModule } from '../utils/sentry'
import { registerPageById } from './byId'
import { registerPageCreate } from './create'
import { registerPageDelete } from './delete'
import { registerPageList } from './list'
import { registerPagePublic } from './public'
import { registerPageUpdate } from './update'

export const pageApi = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: handleZodError,
})
pageApi.use('*', timing())
const module: ContextModule = {
  name: 'page',
}

registerPageById(pageApi)
registerPageCreate(pageApi)
registerPageList(pageApi)
registerPagePublic(pageApi)
registerPageDelete(pageApi)
registerPageUpdate(pageApi)

export default pageApi
