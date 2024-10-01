import { changelog, db } from '@boring.tools/database'
import {
  ChangelogCreateInput,
  ChangelogCreateOutput,
} from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'

export const route = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': { schema: ChangelogCreateInput },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': { schema: ChangelogCreateOutput },
      },
      description: 'Return created changelog',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const func = async ({
  userId,
  payload,
}: {
  userId: string
  payload: z.infer<typeof ChangelogCreateInput>
}) => {
  return await db
    .insert(changelog)
    .values({
      ...payload,
      userId: userId,
    })
    .returning()
}

export default {
  route,
  func,
}
