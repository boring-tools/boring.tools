import { createLazyFileRoute } from '@tanstack/react-router'
import { useChangelogList } from '../../hooks/useChangelog'

const Component = () => {
  const { data, error, isPending } = useChangelogList()

  if (error) {
    return (
      <div className="flex items-center justify-center mt-32 flex-col">
        <h1 className="text-3xl">Changelogs</h1>
        <p>Please try again later</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl">Changelogs</h1>

      {!isPending &&
        data &&
        data.map((changelog) => {
          return <div key={changelog.id}>{changelog.title}</div>
        })}
    </div>
  )
}

export const Route = createLazyFileRoute('/changelog/')({
  component: Component,
})
