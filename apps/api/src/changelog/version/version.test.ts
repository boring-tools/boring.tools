import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import {
  type ChangelogSelect,
  type CommitSelect,
  type UserSelect,
  type VersionSelect,
  changelog,
  commit,
  db,
  user,
} from '@changelog/database'
import type {
  CommitCreateInput,
  VersionCreateInput,
  VersionOutput,
  VersionUpdateInput,
} from '@changelog/schemas'
import type { z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { fetch } from '../../utils/testing/fetch'

describe('Version', () => {
  let testUser: UserSelect
  let testChangelog: ChangelogSelect
  let testCommits: CommitSelect[]
  let testVersion: VersionSelect

  beforeAll(async () => {
    const tUser = await db
      .insert(user)
      .values({ email: 'version@test.local' })
      .returning()
    const tChangelog = await db
      .insert(changelog)
      .values({
        title: 'test',
        description: 'some description',
        userId: tUser[0].id,
      })
      .returning()

    const payload: z.infer<typeof CommitCreateInput> = [
      {
        changelogId: tChangelog[0].id,
        date: new Date(),
        message: 'Some commit',
        shortHash: '1234567',
        body: 'some body',
      },
      {
        changelogId: tChangelog[0].id,
        date: new Date(),
        message: 'Some other commit',
        shortHash: '1234568',
        body: 'some body',
      },
    ]

    await fetch(
      {
        path: '/api/commit',
        method: 'POST',
        body: payload,
      },
      tUser[0],
    )

    testCommits = await db.query.commit.findMany({
      where: eq(commit.changelogId, tChangelog[0].id),
    })
    testUser = tUser[0]
    testChangelog = tChangelog[0]
  })

  afterAll(async () => {
    await db.delete(user).where(eq(user.email, 'version@test.local'))
  })

  describe('Create', () => {
    test('Success', async () => {
      const payload: z.infer<typeof VersionCreateInput> = {
        changelogId: testChangelog.id,
        releasedAt: new Date(),
        commits: testCommits.map((c) => c.shortHash),
        status: 'draft',
        version: '1.0.0',
        markdown: '',
      }

      const res = await fetch(
        {
          path: '/api/version',
          method: 'POST',
          body: payload,
        },
        testUser,
      )

      const json = await res.json()
      testVersion = json

      expect(res.status).toBe(201)
    })

    test('Duplicate', async () => {
      const payload: z.infer<typeof VersionCreateInput> = {
        changelogId: testChangelog.id,
        releasedAt: new Date(),
        commits: testCommits.map((c) => c.shortHash),
        status: 'draft',
        version: '1.0.0',
        markdown: '',
      }

      const res = await fetch(
        {
          path: '/api/version',
          method: 'POST',
          body: payload,
        },
        testUser,
      )
      expect(res.status).toBe(409)
    })
  })

  describe('By Id', () => {
    test('Success', async () => {
      const res = await fetch(
        {
          path: `/api/version/${testVersion.id}`,
          method: 'GET',
        },
        testUser,
      )

      expect(res.status).toBe(200)

      const json: z.infer<typeof VersionOutput> = await res.json()
      expect(json.commits).toHaveLength(2)
    })

    test('Not found', async () => {
      const res = await fetch(
        {
          path: '/api/version/a7d2a68b-0696-4424-96c9-3629ae37978c',
          method: 'GET',
        },
        testUser,
      )

      expect(res.status).toBe(404)
    })
  })

  describe('Update', () => {
    test('Success', async () => {
      const payload: z.infer<typeof VersionUpdateInput> = {
        status: 'published',
        markdown: '',
      }
      const res = await fetch(
        {
          path: `/api/version/${testVersion.id}`,
          method: 'PUT',
          body: payload,
        },
        testUser,
      )

      expect(res.status).toBe(200)
    })
  })

  describe('Remove', () => {
    test('Success', async () => {
      const res = await fetch(
        {
          path: `/api/version/${testVersion.id}`,
          method: 'DELETE',
        },
        testUser,
      )

      expect(res.status).toBe(200)
    })

    test('Not Found', async () => {
      const res = await fetch(
        {
          path: `/api/version/${testVersion.id}`,
          method: 'DELETE',
        },
        testUser,
      )

      expect(res.status).toBe(404)
    })
  })
})
