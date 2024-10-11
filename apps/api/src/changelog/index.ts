import { logger } from '@boring.tools/logger'
import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import type { Variables } from '..'
import { verifyAuthentication } from '../utils/authentication'
import ById from './byId'
import Create from './create'
import Delete from './delete'
import List from './list'
import Update from './update'

const app = new OpenAPIHono<{ Variables: Variables }>()

const changelog_logger = logger.child({ name: 'changelog' })

app.openapi(ById.route, async (c) => {
  const userId = verifyAuthentication(c)
  try {
    const id = c.req.param('id')
    const result = await ById.func({ userId, id })
    return c.json(result, 200)
  } catch (error) {
    changelog_logger.error(error)
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

app.openapi(List.route, async (c) => {
  const userId = verifyAuthentication(c)
  try {
    const result = await List.func({ userId })
    return c.json(result, 200)
  } catch (error) {
    changelog_logger.error(error)
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

app.openapi(Create.route, async (c) => {
  const userId = verifyAuthentication(c)

  try {
    const [result] = await Create.func({
      userId,
      payload: await c.req.json(),
    })
    return c.json(result, 201)
  } catch (error) {
    changelog_logger.error(error)
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

app.openapi(Delete.route, async (c) => {
  const userId = verifyAuthentication(c)

  try {
    const id = c.req.param('id')
    const result = await Delete.func({ userId, id })

    if (result.length === 0) {
      return c.json({ message: 'Changelog not found' }, 404)
    }

    return c.json({ message: 'Changelog removed' })
  } catch (error) {
    changelog_logger.error(error)
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

app.openapi(Update.route, async (c) => {
  const userId = verifyAuthentication(c)

  try {
    const id = c.req.param('id')

    if (!id) {
      return c.json({ message: 'Changelog not found' }, 404)
    }

    const result = await Update.func({
      userId,
      payload: await c.req.json(),
      id,
    })

    if (result.length === 0) {
      return c.json({ message: 'Changelog not found' }, 404)
    }

    return c.json(result)
  } catch (error) {
    changelog_logger.error(error)
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

export default app
