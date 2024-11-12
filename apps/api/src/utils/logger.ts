import { db, user } from '@boring.tools/database'
import { logger as log } from '@boring.tools/logger'
import { eq } from 'drizzle-orm'
import type { MiddlewareHandler } from 'hono'
import { getPath } from 'hono/utils/url'

export const logger = (): MiddlewareHandler => {
  return async function logga(c, next) {
    const { method } = c.req
    const clerkUser = c.get('clerkAuth')
    const requestId = c.get('requestId')
    const [dbUser] = await db
      .select({ id: user.id, providerId: user.providerId })
      .from(user)
      .where(eq(user.providerId, clerkUser?.userId))
    const path = getPath(c.req.raw)

    log.info('Incoming', {
      direction: 'in',
      method,
      path,
      userId: dbUser.id,
      requestId,
    })

    await next()

    if (c.res.status <= 399) {
      log.info('Outgoing', {
        direction: 'out',
        method,
        path,
        status: c.res.status,
        userId: dbUser.id,
        requestId,
      })
    }

    if (c.res.status >= 400 && c.res.status < 499) {
      log.warn('Outgoing', {
        direction: 'out',
        method,
        path,
        status: c.res.status,
        requestId,
      })
    }

    if (c.res.status >= 500) {
      log.error('Outgoing', {
        direction: 'out',
        method,
        path,
        status: c.res.status,
        requestId,
      })
    }
  }
}
