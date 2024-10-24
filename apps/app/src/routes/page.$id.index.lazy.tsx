import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@boring.tools/ui'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { PlusCircleIcon } from 'lucide-react'
import { VersionStatus } from '../components/Changelog/VersionStatus'
import { useChangelogById } from '../hooks/useChangelog'
import { usePageById } from '../hooks/usePage'

const Component = () => {
  const { id } = Route.useParams()
  const { data, isPending } = usePageById({ id })

  return (
    <div className="flex flex-col gap-5">
      {!isPending && data && (
        <div>
          <Card className="w-full max-w-screen-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Changelogs ({data.changelogs?.length})</CardTitle>

                <Link to="/changelog/$id/versionCreate" params={{ id }}>
                  <Button variant={'ghost'} size={'icon'}>
                    <PlusCircleIcon strokeWidth={1.5} className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                {data.changelogs.map((changelog) => {
                  return (
                    <Link
                      className="hover:bg-muted py-1 px-2 rounded transition flex gap-2 items-center"
                      to="/changelog/$id"
                      params={{
                        id: changelog.id,
                      }}
                      key={changelog.id}
                    >
                      {changelog.title}
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

export const Route = createLazyFileRoute('/page/$id/')({
  component: Component,
})
