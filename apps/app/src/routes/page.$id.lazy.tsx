import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@boring.tools/ui'
import { Link, Outlet, createLazyFileRoute } from '@tanstack/react-router'
import { FileStackIcon, PencilIcon } from 'lucide-react'
import { PageDelete } from '../components/Page/Delete'
import { PageWrapper } from '../components/PageWrapper'
import { useChangelogById } from '../hooks/useChangelog'
import { usePageById } from '../hooks/usePage'

const Component = () => {
  const { id } = Route.useParams()
  const { data, error, isPending, refetch } = usePageById({ id })
  console.log(data)
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
          name: 'Page',
          to: '/page',
        },
        { name: data?.title ?? '', to: `/page/${data?.id}` },
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={'ghost'}>
                    <Globe2Icon strokeWidth={1.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Public Page</p>
                </TooltipContent>
              </Tooltip> */}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={'/page/$id/edit'} params={{ id }}>
                      <Button variant={'ghost'}>
                        <PencilIcon strokeWidth={1.5} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>

                <PageDelete id={id} />
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

export const Route = createLazyFileRoute('/page/$id')({
  component: Component,
})
