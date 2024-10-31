import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '..'
import type { ContextModule } from '../utils/sentry'
import { registerStatisticGet } from './get'

export const statisticApi = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'statistic',
}

registerStatisticGet(statisticApi)

export default statisticApi
