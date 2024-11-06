import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import type { Variables } from '..'
import type { ContextModule } from '../utils/sentry'
import { registerChangelogById } from './byId'
import { changelogCommitApi } from './commit'
import { registerChangelogCreate } from './create'
import { registerChangelogDelete } from './delete'
import { registerChangelogList } from './list'
import { registerChangelogUpdate } from './update'
import version from './version'

export const changelogApi = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'changelog',
}
changelogApi.use('*', cors())
changelogApi.route('/commit', changelogCommitApi)
changelogApi.route('/version', version)

registerChangelogById(changelogApi)
registerChangelogCreate(changelogApi)
registerChangelogDelete(changelogApi)
registerChangelogUpdate(changelogApi)
registerChangelogList(changelogApi)

export default changelogApi
