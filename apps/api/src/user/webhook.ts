import { db, user } from '@boring.tools/database'
import { logger } from '@boring.tools/logger'
import { UserOutput, UserWebhookInput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { Webhook } from 'svix'
import type userApi from '.'

const route = createRoute({
  method: 'post',
  path: '/webhook',
  tags: ['user'],
  request: {
    body: {
      content: {
        'application/json': { schema: UserWebhookInput },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': { schema: UserOutput },
      },
      description: 'Return success',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

const userCreate = async ({
  payload,
}: {
  payload: z.infer<typeof UserWebhookInput>
}) => {
  const data = {
    providerId: payload.data.id,
    name: `${payload.data.first_name} ${payload.data.last_name}`,
    email: payload.data.email_addresses[0].email_address,
  }
  try {
    await db
      .insert(user)
      .values({
        ...data,
      })
      .onConflictDoUpdate({
        target: user.providerId,
        set: data,
      })

    logger.info('Clerk webhook user created', payload.data)
    return true
  } catch (error) {
    logger.error('Clerk webhook user create failed', error)
    return false
  }
}

export const registerUserWebhook = (api: typeof userApi) => {
  return api.openapi(route, async (c) => {
    const wh = new Webhook(import.meta.env.CLERK_WEBHOOK_SECRET as string)
    const payload = await c.req.json()
    const headers = c.req.header()
    const verifiedPayload = wh.verify(JSON.stringify(payload), headers)
    switch (verifiedPayload.type) {
      case 'user.created': {
        const result = await userCreate({ payload: verifiedPayload })
        logger.info('Clerk Webhook', result)
        return c.json(result, 200)
      }
      default:
        throw new HTTPException(404, { message: 'Webhook type not supported' })
    }
  })
}
