import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '../..'
import { type ContextModule, captureSentry } from '../../utils/sentry'
import ById from './byId'

const app = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'changelog',
  sub_module: 'public',
}

app.openapi(ById.route, async (c) => {
  try {
    const id = c.req.param('id')
    const result = await ById.func({ id })
    return c.json(result, 200)
  } catch (error) {
    return captureSentry({
      c,
      error,
      module,
    })
  }
})

export default app
