import { logger } from '@boring.tools/logger'
import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import type { Variables } from '../..'
import { verifyAuthentication } from '../../utils/authentication'
import { byId, byIdFunc } from './byId'
import { create, createFunc } from './create'
import { remove, removeFunc } from './delete'
import { update, updateFunc } from './update'

const app = new OpenAPIHono<{ Variables: Variables }>()

const version_logger = logger.child({ name: 'changelog_version' })

app.openapi(create, async (c) => {
  const userId = verifyAuthentication(c)
  try {
    const payload = await c.req.json()
    const result = await createFunc({ userId, payload })

    if (!result) {
      return c.json({ message: 'Version not created' }, 400)
    }

    return c.json(result, 201)
  } catch (error) {
    version_logger.error(error)
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

app.openapi(byId, async (c) => {
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
    version_logger.error(error)
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

app.openapi(update, async (c) => {
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
    version_logger.error(error)
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

app.openapi(remove, async (c) => {
  try {
    const userId = verifyAuthentication(c)
    const id = c.req.param('id')
    const result = await removeFunc({ userId, id })

    if (result.length === 0) {
      return c.json({ message: 'Version not found' }, 404)
    }

    return c.json({ message: 'Version removed' })
  } catch (error) {
    version_logger.error(error)
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    return c.json({ message: 'An unexpected error occurred' }, 500)
  }
})

export default app
