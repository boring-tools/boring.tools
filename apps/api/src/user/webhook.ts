import { db, user } from '@boring.tools/database'
import { logger } from '@boring.tools/logger'
import { UserOutput, UserWebhookInput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

export const route = createRoute({
  method: 'post',
  path: '/webhook',
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
    id: payload.data.id,
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
        target: user.id,
        set: data,
      })

    logger.info('Clerk webhook user created', payload.data)
    return true
  } catch (error) {
    logger.error('Clerk webhook user create failed', error)
    return false
  }
}

export const func = async ({
  payload,
}: {
  payload: z.infer<typeof UserWebhookInput>
}) => {
  switch (payload.type) {
    case 'user.created':
      return userCreate({ payload })
    default:
      throw new HTTPException(404, { message: 'Webhook type not supported' })
  }
}

export default {
  route,
  func,
}
