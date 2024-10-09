import { Button } from '@boring.tools/ui'
import { createFileRoute } from '@tanstack/react-router'
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
    <div className="flex flex-col gap-5">
      {!isPending && data && <div>version page</div>}
    </div>
  )
}

export const Route = createFileRoute('/changelog/$id/version/$versionId')({
  component: Component,
})
