import { createLazyFileRoute } from '@tanstack/react-router'
import { ChangelogCommitList } from '../components/Changelog/CommitList'
import { ChangelogVersionList } from '../components/Changelog/VersionList'

const Component = () => {
  return (
    <div className="flex gap-5 flex-wrap">
      <ChangelogVersionList />
      <ChangelogCommitList />
    </div>
  )
}

export const Route = createLazyFileRoute('/changelog/$id/')({
  component: Component,
})
