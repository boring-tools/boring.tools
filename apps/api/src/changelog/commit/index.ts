import { OpenAPIHono } from '@hono/zod-openapi'
import type { Variables } from '../..'
import type { ContextModule } from '../../utils/sentry'
import { regsiterCommitCreate } from './create'

export const changelogCommitApi = new OpenAPIHono<{ Variables: Variables }>()

const module: ContextModule = {
  name: 'changelog',
  sub_module: 'version',
}

regsiterCommitCreate(changelogCommitApi)

// app.openapi(create, async (c) => {
//   const userId = verifyAuthentication(c)
//   try {
//     const payload = await c.req.json()
//     const result = await createFunc({ userId, payload })

//     if (!result) {
//       return c.json({ message: 'Version not created' }, 400)
//     }

//     return c.json(result, 201)
//   } catch (error) {
//     return captureSentry({
//       c,
//       error,
//       module,
//       user: {
//         id: userId,
//       },
//     })
//   }
// })

/* app.openapi(byId, async (c) => {
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

app.openapi(remove, async (c) => {
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
}) */