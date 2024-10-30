import type { UserOutput } from '@boring.tools/schema'
import { sentry } from '@hono/sentry'
import { OpenAPIHono, type z } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'

import changelog from './changelog'
import user from './user'

import { accessTokenApi } from './access-token'
import pageApi from './page'
import { authentication } from './utils/authentication'
import { handleError, handleZodError } from './utils/errors'
import { startup } from './utils/startup'

type User = z.infer<typeof UserOutput>

export type Variables = {
  user: User
}

export const app = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: handleZodError,
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

app.route('/v1/user', user)
app.route('/v1/changelog', changelog)
app.route('/v1/page', pageApi)
app.route('/v1/access-token', accessTokenApi)

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
