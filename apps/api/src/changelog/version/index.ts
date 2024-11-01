import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '../..'
import { verifyAuthentication } from '../../utils/authentication'
import { type ContextModule, captureSentry } from '../../utils/sentry'
import { byId, byIdFunc } from './byId'
import { create, createFunc } from './create'
import { registerVersionCreateAuto } from './createAuto'
import { remove, removeFunc } from './delete'
import { update, updateFunc } from './update'

export const changelogVersionApi = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'changelog',
  sub_module: 'version',
}

registerVersionCreateAuto(changelogVersionApi)

changelogVersionApi.openapi(create, async (c) => {
  const userId = verifyAuthentication(c)
  try {
    const payload = await c.req.json()
    const result = await createFunc({ userId, payload })

    if (!result) {
      return c.json({ message: 'Version not created' }, 400)
    }

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

changelogVersionApi.openapi(byId, async (c) => {
  const userId = verifyAuthentication(c)
  try {
    const id = c.req.param('id')
    const result = await byIdFunc({ userId, id })

    if (!result) {
      return c.json({ message: 'Version not found' }, 404)
    }

    // Ensure all required properties are present and non-null
    return c.json(
      {
        ...result,
        changelogId: result.changelogId || '',
        version: result.version || '',
        status: result.status || 'draft',
        releasedAt: result.releasedAt,
        commits: result.commits || [],
        markdown: result.markdown || '',
      },
      200,
    )
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

changelogVersionApi.openapi(update, async (c) => {
  const userId = verifyAuthentication(c)
  try {
    const id = c.req.param('id')

    if (!id) {
      return c.json({ message: 'Version not found' }, 404)
    }

    const result = await updateFunc({
      userId,
      payload: await c.req.json(),
      id,
    })

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

changelogVersionApi.openapi(remove, async (c) => {
  const userId = verifyAuthentication(c)
  try {
    const id = c.req.param('id')
    const result = await removeFunc({ userId, id })

    if (result.length === 0) {
      return c.json({ message: 'Version not found' }, 404)
    }

    return c.json({ message: 'Version removed' })
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

export default changelogVersionApi
