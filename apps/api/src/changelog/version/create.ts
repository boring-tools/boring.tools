import {
  changelog,
  changelog_commit,
  changelog_version,
  db,
} from '@boring.tools/database'
import { VersionCreateInput, VersionCreateOutput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { and, eq, inArray } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import semver from 'semver'

export const create = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': { schema: VersionCreateInput },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': { schema: VersionCreateOutput },
      },
      description: 'Version created',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const createFunc = async ({
  userId,
  payload,
}: {
  userId: string
  payload: z.infer<typeof VersionCreateInput>
}) => {
  const formattedVersion = semver.coerce(payload.version)
  const validVersion = semver.valid(formattedVersion)

  const changelogResult = await db.query.changelog.findFirst({
    where: and(
      eq(changelog.userId, userId),
      eq(changelog.id, payload.changelogId),
    ),
  })

  if (!changelogResult) {
    throw new HTTPException(404, {
      message: 'changelog not found',
    })
  }

  if (validVersion === null) {
    throw new HTTPException(409, {
      message: 'Version is not semver compatible',
    })
  }

  // Check if a version with the same version already exists
  const versionResult = await db.query.changelog_version.findFirst({
    where: and(
      eq(changelog_version.changelogId, payload.changelogId),
      eq(changelog_version.version, validVersion),
    ),
  })

  if (versionResult) {
    throw new HTTPException(409, {
      message: 'Version exists already',
    })
  }

  const [versionCreateResult] = await db
    .insert(changelog_version)
    .values({
      changelogId: payload.changelogId,
      version: validVersion,
      status: payload.status,
      markdown: payload.markdown,
    })
    .returning()

  await db
    .update(changelog_commit)
    .set({ versionId: versionCreateResult.id })
    .where(inArray(changelog_commit.id, payload.commitIds))

  return versionCreateResult
}
