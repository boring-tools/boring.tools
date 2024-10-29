import { Card, CardContent, CardHeader, CardTitle } from '@boring.tools/ui'
import { Link, useParams } from '@tanstack/react-router'
import { useChangelogById } from '../../hooks/useChangelog'
import { ChangelogVersionCreate } from './Version/Create'
import { VersionStatus } from './VersionStatus'

export const ChangelogVersionList = () => {
  const { id } = useParams({ from: '/changelog/$id' })
  const { data } = useChangelogById({ id })

  if (data) {
    return (
      <Card className="w-full max-w-screen-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Versions ({data.versions?.length})</CardTitle>

            <ChangelogVersionCreate />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            {data.versions?.map((version) => {
              return (
                <Link
                  className="hover:bg-muted py-1 px-2 rounded transition flex gap-2 items-center"
                  to="/changelog/$id/version/$versionId"
                  params={{
                    id,
                    versionId: version.id,
                  }}
                  key={version.id}
                >
                  <VersionStatus status={version.status} />
                  {version.version}
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return <div className="flex flex-col gap-5">Not found</div>
}
