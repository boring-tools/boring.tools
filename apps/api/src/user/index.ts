import { logger } from '@boring.tools/logger'
import { OpenAPIHono } from '@hono/zod-openapi'
import { Webhook } from 'svix'
import type { Variables } from '..'
import { type ContextModule, captureSentry } from '../utils/sentry'
import get from './get'
import webhook from './webhook'

const app = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'user',
}

app.openapi(get.route, async (c) => {
  const user = c.get('user')
  try {
    const result = await get.func({ user })
    return c.json(result, 201)
  } catch (error) {
    return captureSentry({
      c,
      error,
      module,
      user,
    })
  }
})

app.openapi(webhook.route, async (c) => {
  try {
    const wh = new Webhook(import.meta.env.CLERK_WEBHOOK_SECRET as string)
    const payload = await c.req.json()
    const headers = c.req.header()
    const verifiedPayload = wh.verify(JSON.stringify(payload), headers)
    const result = await webhook.func({ payload: verifiedPayload })
    logger.info('Clerk Webhook', result)
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
