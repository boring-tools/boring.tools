import { access_token, db, user } from '@boring.tools/database'
import { logger } from '@boring.tools/logger'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { eq } from 'drizzle-orm'
import type { Context, Next } from 'hono'
import { some } from 'hono/combine'
import { HTTPException } from 'hono/http-exception'

const generatedToken = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  const token = authHeader.replace('Bearer ', '')

  const accessTokenResult = await db.query.access_token.findFirst({
    where: eq(access_token.token, token),
    with: {
      user: true,
    },
  })

  if (!accessTokenResult) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  await db
    .update(access_token)
    .set({ lastUsedOn: new Date() })
    .where(eq(access_token.id, accessTokenResult.id))

  c.set('user', accessTokenResult.user)

  await next()
}

export const authentication = some(generatedToken, clerkMiddleware())

export const verifyAuthentication = async (c: Context) => {
  const auth = getAuth(c)
  if (!auth?.userId) {
    const accessTokenUser = c.get('user')
    if (!accessTokenUser) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }
    return accessTokenUser.id
  }

  const [userEntry] = await db
    .select()
    .from(user)
    .where(eq(user.providerId, auth.userId))

  if (!userEntry) {
    logger.error('User not found - Unauthorized', { providerId: auth.userId })
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  return userEntry.id
}
