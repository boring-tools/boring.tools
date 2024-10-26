import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '../..'
import type { ContextModule } from '../../utils/sentry'
import { registerCommitCreate } from './create'
import { registerCommitList } from './list'

export const changelogCommitApi = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'changelog',
  sub_module: 'version',
}

registerCommitCreate(changelogCommitApi)
registerCommitList(changelogCommitApi)
