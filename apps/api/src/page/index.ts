import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '..'
import type { ContextModule } from '../utils/sentry'
import { registerPageById } from './byId'
import { registerPageCreate } from './create'
import { registerPageDelete } from './delete'
import { registerPageList } from './list'
import { registerPagePublic } from './public'
import { registerPageUpdate } from './update'

export const pageApi = new OpenAPIHono<{ Variables: Variables }>()

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
