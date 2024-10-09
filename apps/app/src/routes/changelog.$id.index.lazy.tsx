import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@boring.tools/ui'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { PlusCircleIcon } from 'lucide-react'
import { useChangelogById } from '../hooks/useChangelog'

const VersionStatus = ({ status }: { status: string }) => {
  switch (status) {
    case 'draft':
      return <div className="w-3 h-3 rounded-full bg-amber-600" />
    case 'published':
      return <div className="w-3 h-3 rounded-full bg-emerald-600" />
    case 'review':
      return <div className="w-3 h-3 rounded-full bg-sky-600" />
    default:
      return <div className="w-3 h-3 rounded-full bg-neutral-600" />
  }
}

const Component = () => {
  const { id } = Route.useParams()
  const { data, isPending } = useChangelogById({ id })

  return (
    <div className="flex flex-col gap-5">
      {!isPending && data && (
        <div>
          <Card className="w-full max-w-screen-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Versions ({data.versions?.length})</CardTitle>

                <Link to="/changelog/$id/versionCreate" params={{ id }}>
                  <Button variant={'ghost'} size={'icon'}>
                    <PlusCircleIcon strokeWidth={1.5} className="w-5 h-5" />
                  </Button>
                </Link>
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
        </div>
      )}
    </div>
  )
}

export const Route = createLazyFileRoute('/changelog/$id/')({
  component: Component,
})
