import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@boring.tools/ui'
import { Link, Outlet, createLazyFileRoute } from '@tanstack/react-router'
import { PlusCircleIcon } from 'lucide-react'
import { useChangelogById } from '../hooks/useChangelog'

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
              {data.versions?.map((version) => {
                return <div key={version.id}>{version.version}</div>
              })}
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
