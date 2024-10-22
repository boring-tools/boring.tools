import { logger } from '@boring.tools/logger'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export type ContextModule = {
  name: string
  sub_module?: string
}

type ContextUser = {
  id: string
}

const route_logger = logger.child({ name: 'hono' })

export const captureSentry = ({
  c,
  user,
  module,
  error,
}: {
  c: Context
  user?: ContextUser
  module: ContextModule
  error: unknown
}) => {
  route_logger.error(error)

  c.get('sentry').setContext('module', module)
  c.get('sentry').setContext('user', user)
  c.get('sentry').captureException(error)

  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status)
  }
  return c.json({ message: 'An unexpected error occurred' }, 500)
}
