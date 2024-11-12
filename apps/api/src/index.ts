import type { UserOutput } from '@boring.tools/schema'
// import { sentry } from '@hono/sentry'
import { OpenAPIHono, type z } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'

import changelog from './changelog'

import { accessTokenApi } from './access-token'
import pageApi from './page'
import statisticApi from './statistic'
import userApi from './user'
import { authentication } from './utils/authentication'
import { handleError, handleZodError } from './utils/errors'
import { logger } from './utils/logger'
import { startup } from './utils/startup'

type User = z.infer<typeof UserOutput>

export type Variables = {
  user: User
}

export const app = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: handleZodError,
  strict: false,
})

// app.use(
//   '*',
//   sentry({
//     dsn: 'https://1d7428bbab0a305078cf4aa380721aa2@o4508167321354240.ingest.de.sentry.io/4508167323648080',
//   }),
// )

app.onError(handleError)
app.use('*', cors())
app.use('/v1/*', authentication)
app.use('*', requestId())
app.use(logger())
app.openAPIRegistry.registerComponent('securitySchemes', 'AccessToken', {
  type: 'http',
  scheme: 'bearer',
})
app.openAPIRegistry.registerComponent('securitySchemes', 'Clerk', {
  type: 'http',
  scheme: 'bearer',
})

app.route('/v1/user', userApi)
app.route('/v1/changelog', changelog)
app.route('/v1/page', pageApi)
app.route('/v1/access-token', accessTokenApi)
app.route('/v1/statistic', statisticApi)

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '0.0.0',
    title: 'boring.tools',
  },
})

app.get(
  '/',
  apiReference({
    pageTitle: 'boring.tools API',
    theme: 'purple',
    spec: {
      url: '/openapi.json',
    },
  }),
)

await startup()
export default {
  port: 3000,
  fetch: app.fetch,
}
