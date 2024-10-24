import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@boring.tools/ui'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { CircleMinusIcon, PlusCircleIcon } from 'lucide-react'
import { usePageById, usePageUpdate } from '../hooks/usePage'

const Component = () => {
  const { id } = Route.useParams()
  const { data, isPending } = usePageById({ id })
  const pageUpdate = usePageUpdate()
  const removeChangelog = (id: string) => {
    const payload = {
      title: data?.title,
      description: data?.description,
      changelogIds: data?.changelogs
        .filter((log) => log.id !== id)
        .map((l) => l.id),
    }
    pageUpdate.mutate({ id, payload })
  }

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
                    <div className="flex gap-3" key={changelog.id}>
                      <Link
                        className="hover:bg-muted py-1 px-2 rounded transition flex gap-2 items-center w-full"
                        to="/changelog/$id"
                        params={{
                          id: changelog.id,
                        }}
                      >
                        {changelog.title}
                      </Link>

                      <Button
                        size={'icon'}
                        variant={'destructive'}
                        onClick={() => removeChangelog(changelog.id)}
                      >
                        <CircleMinusIcon className="w-4 h-4" />
                      </Button>
                    </div>
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
