import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@boring.tools/ui'
import { Link, Outlet, createLazyFileRoute } from '@tanstack/react-router'
import { FileStackIcon, PencilIcon } from 'lucide-react'
import { ChangelogDelete } from '../components/Changelog/Delete'
import { PageWrapper } from '../components/PageWrapper'
import { useChangelogById } from '../hooks/useChangelog'

const Component = () => {
  const { id } = Route.useParams()
  const { data, error, isPending, refetch } = useChangelogById({ id })
  if (error) {
    return (
      <div className="flex items-center justify-center mt-32 flex-col">
        <h1 className="text-3xl">Changelogs</h1>
        <p>Please try again later</p>

        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <PageWrapper
      breadcrumbs={[
        {
          name: 'Changelog',
          to: '/changelog',
        },
        { name: data?.title ?? '', to: `/changelog/${data?.id}` },
      ]}
    >
      <div className="flex flex-col gap-5">
        {!isPending && data && (
          <div>
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <FileStackIcon
                  strokeWidth={1.5}
                  className="w-10 h-10 text-muted-foreground"
                />
                <div>
                  <h1 className="text-3xl">{data.title}</h1>

                  <p className="text-muted-foreground mt-2">
                    {data.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={'ghost'}>
                    <TerminalSquareIcon strokeWidth={1.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>CLI</p>
                </TooltipContent>
              </Tooltip>

               */}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={'/changelog/$id/edit'} params={{ id }}>
                      <Button variant={'ghost'}>
                        <PencilIcon strokeWidth={1.5} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>

                <ChangelogDelete id={id} />
              </div>
            </div>
            <div className="mt-5">
              <Outlet />
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export const Route = createLazyFileRoute('/changelog/$id')({
  component: Component,
})
