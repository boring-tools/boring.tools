import { changelog, changelog_version, db } from '@boring.tools/database'
import { VersionCreateInput, VersionCreateOutput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
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
  const versionResult = await db.query.version.findFirst({
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

  return versionCreateResult
}
