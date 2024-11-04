import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '..'
import { verifyAuthentication } from '../utils/authentication'
import { type ContextModule, captureSentry } from '../utils/sentry'
import ById from './byId'
import { changelogCommitApi } from './commit'
import Create from './create'
import Delete from './delete'
import List from './list'
import Update from './update'
import version from './version'

const app = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'changelog',
}
app.route('/commit', changelogCommitApi)
app.route('/version', version)
app.openapi(ById.route, async (c) => {
  const userId = await verifyAuthentication(c)
  try {
    const id = c.req.param('id')
    const result = await ById.func({ userId, id })
    return c.json(result, 200)
  } catch (error) {
    return captureSentry({
      c,
      error,
      module,
      user: {
        id: userId,
      },
    })
  }
})

app.openapi(List.route, async (c) => {
  const userId = await verifyAuthentication(c)
  try {
    const result = await List.func({ userId })
    return c.json(result, 200)
  } catch (error) {
    return captureSentry({
      c,
      error,
      module,
      user: {
        id: userId,
      },
    })
  }
})

app.openapi(Create.route, async (c) => {
  const userId = await verifyAuthentication(c)

  try {
    const [result] = await Create.func({
      userId,
      payload: await c.req.json(),
    })
    return c.json(result, 201)
  } catch (error) {
    return captureSentry({
      c,
      error,
      module,
      user: {
        id: userId,
      },
    })
  }
})

app.openapi(Delete.route, async (c) => {
  const userId = await verifyAuthentication(c)

  try {
    const id = c.req.param('id')
    const result = await Delete.func({ userId, id })

    if (result.length === 0) {
      return c.json({ message: 'Changelog not found' }, 404)
    }

    return c.json({ message: 'Changelog removed' })
  } catch (error) {
    return captureSentry({
      c,
      error,
      module,
      user: {
        id: userId,
      },
    })
  }
})

app.openapi(Update.route, async (c) => {
  const userId = await verifyAuthentication(c)

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
    return captureSentry({
      c,
      error,
      module,
      user: {
        id: userId,
      },
    })
  }
})

export default app
