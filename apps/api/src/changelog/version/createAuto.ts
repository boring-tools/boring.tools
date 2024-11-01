import {
  changelog,
  changelog_commit,
  changelog_version,
  db,
} from '@boring.tools/database'
import {
  VersionCreateAutoInput,
  VersionCreateOutput,
} from '@boring.tools/schema'
import { createRoute, type z } from '@hono/zod-openapi'
import { format } from 'date-fns'
import { and, eq, isNull } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import semver from 'semver'
import type { changelogVersionApi } from '.'
import { verifyAuthentication } from '../../utils/authentication'
import { commitsToMarkdown } from '../../utils/git/commitsToMarkdown'

export const route = createRoute({
  method: 'post',
  path: '/auto',
  tags: ['commit'],
  request: {
    body: {
      content: {
        'application/json': { schema: VersionCreateAutoInput },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': { schema: VersionCreateOutput },
      },
      description: 'Commits created',
    },
    400: {
      description: 'Bad Request',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
})

const getNextVersion = ({
  version,
  isSemver,
}: { version: string; isSemver: boolean }): string => {
  if (isSemver) {
    if (version === '') {
      return '1.0.0'
    }
    const nextVersion = semver.inc(version, 'patch')
    if (!nextVersion) {
      throw new Error('Incorrect semver')
    }
    return nextVersion
  }
  return format(new Date(), 'dd.MM.yy')
}

export const registerVersionCreateAuto = (api: typeof changelogVersionApi) => {
  return api.openapi(route, async (c) => {
    const userId = verifyAuthentication(c)

    const data: z.infer<typeof VersionCreateAutoInput> = await c.req.json()
    const changelogResult = await db.query.changelog.findFirst({
      where: and(
        eq(changelog.id, data.changelogId),
        eq(changelog.userId, userId),
      ),
      with: {
        versions: {
          columns: {
            version: true,
          },
          orderBy: (_, { asc }) => asc(changelog_version.createdAt),
          limit: 1,
        },
      },
    })

    if (!changelogResult) {
      throw new HTTPException(404, {
        message: 'Version could not be created. Changelog not found.',
      })
    }

    if (!changelogResult.isConventional) {
      throw new HTTPException(500, {
        message: 'Auto generating only works with conventional commits.',
      })
    }

    const commits = await db.query.changelog_commit.findMany({
      where: and(
        isNull(changelog_commit.versionId),
        eq(changelog_commit.changelogId, data.changelogId),
      ),
    })
    // @ts-ignore
    const markdown = await commitsToMarkdown(commits)

    // If no version exists, create the first one
    if (changelogResult?.versions.length === 0) {
      // If the changelog follows semver starts with version 1.0.0
      const inputVersion = changelog.isSemver
        ? semver.valid(semver.coerce(data.version))
        : data.version
      const [versionCreateResult] = await db
        .insert(changelog_version)
        .values({
          changelogId: changelogResult.id,
          version:
            inputVersion ??
            getNextVersion({
              version: '',
              isSemver: changelogResult.isSemver ?? true,
            }),
          status: 'draft',
          markdown,
        })
        .returning()

      await db
        .update(changelog_commit)
        .set({ versionId: versionCreateResult.id })
        .where(isNull(changelog_commit.versionId))

      return c.json(versionCreateResult, 201)
    }

    const [versionCreateResult] = await db
      .insert(changelog_version)
      .values({
        changelogId: changelogResult.id,
        version: getNextVersion({
          version: data.version ?? changelogResult.versions[0].version,
          isSemver: changelogResult.isSemver ?? true,
        }),
        status: 'draft',
        markdown,
      })
      .returning()

    await db
      .update(changelog_commit)
      .set({ versionId: versionCreateResult.id })
      .where(isNull(changelog_commit.versionId))

    return c.json(versionCreateResult, 201)
  })
}
