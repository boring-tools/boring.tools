import { OpenAPIHono, type z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import type { Variables } from '..'
import get from './get'
import webhook from './webhook'

const app = new OpenAPIHono<{ Variables: Variables }>()

app.openapi(get.route, async (c) => {
  try {
    const user = c.get('user')
    const result = await get.func({ user })
    return c.json(result, 201)
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

app.openapi(webhook.route, async (c) => {
  try {
    const result = await webhook.func({ payload: await c.req.json() })
    return c.json(result, 200)
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

export default app
