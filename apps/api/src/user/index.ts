import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { Webhook } from 'svix'
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
    const wh = new Webhook(import.meta.env.CLERK_WEBHOOK_SECRET as string)
    const payload = await c.req.json()
    const headers = c.req.header()
    const verifiedPayload = wh.verify(JSON.stringify(payload), headers)
    const result = await webhook.func({ payload: verifiedPayload })
    return c.json(result, 200)
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

export default app
