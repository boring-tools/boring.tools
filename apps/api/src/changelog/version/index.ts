import { OpenAPIHono } from '@hono/zod-openapi'

import type { Variables } from '../..'
import type { ContextModule } from '../../utils/sentry'
import { registerVersionById } from './byId'
import { registerVersionCreate } from './create'
import { registerVersionCreateAuto } from './createAuto'
import { registerVersionDelete } from './delete'
import { registerVersionUpdate } from './update'

export const changelogVersionApi = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'changelog',
  sub_module: 'version',
}

registerVersionCreateAuto(changelogVersionApi)
registerVersionById(changelogVersionApi)
registerVersionCreate(changelogVersionApi)
registerVersionDelete(changelogVersionApi)
registerVersionUpdate(changelogVersionApi)

export default changelogVersionApi
