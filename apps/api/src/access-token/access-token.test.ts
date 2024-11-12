import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { access_token, db, user } from '@boring.tools/database'
import type {
  AccessTokenCreateInput,
  AccessTokenListOutput,
  AccessTokenOutput,
  ChangelogCreateInput,
  ChangelogCreateOutput,
  ChangelogListOutput,
  ChangelogOutput,
  UserOutput,
} from '@boring.tools/schema'
import type { z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { fetch } from '../utils/testing/fetch'

describe('AccessToken', () => {
  let testUser: z.infer<typeof UserOutput>
  let testAccessToken: z.infer<typeof AccessTokenOutput>
  let createdAccessToken: z.infer<typeof AccessTokenOutput>
  let testChangelog: z.infer<typeof ChangelogOutput>

  beforeAll(async () => {
    const createdUser = await db
      .insert(user)
      .values({ email: 'access_token@test.local', providerId: 'test_000' })
      .returning()
    const tAccessToken = await db
      .insert(access_token)
      .values({
        token: '1234567890',
        userId: createdUser[0].id,
        name: 'testtoken',
      })
      .returning()
    testAccessToken = tAccessToken[0] as z.infer<typeof AccessTokenOutput>
    testUser = createdUser[0] as z.infer<typeof UserOutput>
  })

  afterAll(async () => {
    await db.delete(user).where(eq(user.email, 'access_token@test.local'))
  })

  describe('Create', () => {
    test('Success', async () => {
      const payload: z.infer<typeof AccessTokenCreateInput> = {
        name: 'Test Token',
      }

      const res = await fetch(
        {
          path: '/v1/access-token',
          method: 'POST',
          body: payload,
        },
        testAccessToken.token as string,
      )

      const json = (await res.json()) as z.infer<typeof AccessTokenOutput>

      createdAccessToken = json
      expect(res.status).toBe(201)
    })
  })

  // describe('By Id', () => {
  //   test('Success', async () => {
  //     const res = await fetch(
  //       {
  //         path: `/v1/changelog/${testChangelog.id}`,
  //         method: 'GET',
  //       },
  //       testAccessToken.token as string,
  //     )

  //     expect(res.status).toBe(200)
  //   })

  //   test('Not Found', async () => {
  //     const res = await fetch(
  //       {
  //         path: '/v1/changelog/635f4aa7-79fc-4d6b-af7d-6731999cc8bb',
  //         method: 'GET',
  //       },
  //       testAccessToken.token as string,
  //     )

  //     expect(res.status).toBe(404)
  //   })

  //   test('Invalid Id', async () => {
  //     const res = await fetch(
  //       {
  //         path: '/v1/changelog/some',
  //         method: 'GET',
  //       },
  //       testAccessToken.token as string,
  //     )

  //     expect(res.status).toBe(400)

  //     const json = (await res.json()) as { success: boolean }
  //     expect(json.success).toBeFalse()
  //   })
  // })

  describe('List', () => {
    test('Success', async () => {
      const res = await fetch(
        {
          path: '/v1/access-token',
          method: 'GET',
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(200)

      const json = (await res.json()) as z.infer<typeof AccessTokenListOutput>
      // Check if token is redacted
      expect(json[0].token).toHaveLength(10)
      expect(json).toHaveLength(2)
    })
  })

  describe('Remove', () => {
    test('Success', async () => {
      const res = await fetch(
        {
          path: `/v1/access-token/${createdAccessToken.id}`,
          method: 'DELETE',
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(200)
    })

    test('Not found', async () => {
      const res = await fetch(
        {
          path: `/v1/access-token/${createdAccessToken.id}`,
          method: 'DELETE',
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(404)
    })
  })
})
