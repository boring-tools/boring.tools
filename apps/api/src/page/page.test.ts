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
  PageCreateInput,
  PageListOutput,
  PageOutput,
  PageUpdateInput,
  UserOutput,
} from '@boring.tools/schema'
import type { z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { fetch } from '../utils/testing/fetch'

describe('Page', () => {
  let testUser: z.infer<typeof UserOutput>
  let testAccessToken: z.infer<typeof AccessTokenOutput>
  let createdAccessToken: z.infer<typeof AccessTokenOutput>
  let testPage: z.infer<typeof PageOutput>

  beforeAll(async () => {
    const createdUser = await db
      .insert(user)
      .values({ email: 'page@test.local', providerId: 'test_000' })
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
    await db.delete(user).where(eq(user.email, 'page@test.local'))
  })

  describe('Create', () => {
    test('Success', async () => {
      const payload: z.infer<typeof PageCreateInput> = {
        title: 'Test Page',
        changelogIds: [],
      }

      const res = await fetch(
        {
          path: '/v1/page',
          method: 'POST',
          body: payload,
        },
        testAccessToken.token as string,
      )

      const json = (await res.json()) as z.infer<typeof PageOutput>
      testPage = json
      expect(res.status).toBe(201)
    })
  })

  describe('By Id', () => {
    test('Success', async () => {
      const res = await fetch(
        {
          path: `/v1/page/${testPage.id}`,
          method: 'GET',
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(200)
    })

    test('Not Found', async () => {
      const res = await fetch(
        {
          path: '/v1/page/635f4aa7-79fc-4d6b-af7d-6731999cc8bb',
          method: 'GET',
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(404)
    })
  })

  describe('Update', () => {
    test('Success', async () => {
      const update: z.infer<typeof PageUpdateInput> = {
        title: 'Test Update',
      }
      const res = await fetch(
        {
          path: `/v1/page/${testPage.id}`,
          method: 'PUT',
          body: update,
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(200)
    })
  })

  describe('Public', () => {
    test('Success', async () => {
      const res = await fetch(
        {
          path: `/v1/page/${testPage.id}/public`,
          method: 'GET',
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(200)
    })
  })

  describe('List', () => {
    test('Success', async () => {
      const res = await fetch(
        {
          path: '/v1/page',
          method: 'GET',
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(200)

      const json = (await res.json()) as z.infer<typeof PageListOutput>
      // Check if token is redacted
      expect(json).toHaveLength(1)
    })
  })

  describe('Remove', () => {
    test('Success', async () => {
      const res = await fetch(
        {
          path: `/v1/page/${testPage.id}`,
          method: 'DELETE',
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(200)
    })

    test('Not found', async () => {
      const res = await fetch(
        {
          path: `/v1/page/${testPage.id}`,
          method: 'DELETE',
        },
        testAccessToken.token as string,
      )

      expect(res.status).toBe(404)
    })
  })
})
