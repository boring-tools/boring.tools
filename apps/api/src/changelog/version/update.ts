import { changelog, changelog_version, db } from '@boring.tools/database'
import { VersionUpdateInput, VersionUpdateOutput } from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

export const update = createRoute({
  method: 'put',
  path: '/:id',
  request: {
    body: {
      content: {
        'application/json': { schema: VersionUpdateInput },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': { schema: VersionUpdateOutput },
      },
      description: 'Return updated version',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

export const updateFunc = async ({
  userId,
  payload,
  id,
}: {
  userId: string
  payload: z.infer<typeof VersionUpdateInput>
  id: string
}) => {
  const changelogResult = await db.query.changelog.findMany({
    where: and(eq(changelog.userId, userId)),
    with: {
      versions: {
        where: eq(changelog_version.id, id),
      },
    },
  })

  const findChangelog = changelogResult.find((change) =>
    change.versions.find((ver) => ver.id === id),
  )

  if (!findChangelog?.versions.length) {
    throw new HTTPException(404, {
      message: 'Version not found',
    })
  }

  const [versionUpdateResult] = await db
    .update(changelog_version)
    .set({
      status: payload.status,
      markdown: payload.markdown,
      releasedAt: payload.status === 'published' ? new Date() : null,
    })
    .where(and(eq(changelog_version.id, id)))
    .returning()

  return versionUpdateResult
}
