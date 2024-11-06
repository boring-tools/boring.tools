import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@boring.tools/ui'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { PlusCircleIcon } from 'lucide-react'
import { PageWrapper } from '../components/PageWrapper'
import { useChangelogList } from '../hooks/useChangelog'

const Component = () => {
  const { data, error, isPending, refetch } = useChangelogList()

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
    <PageWrapper breadcrumbs={[{ name: 'Changelog', to: '/changelog' }]}>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">Changelog</h1>

        <div className="flex gap-10 w-full flex-wrap">
          {!isPending &&
            data &&
            data.map((changelog) => {
              return (
                <Link
                  to="/changelog/$id"
                  params={{ id: changelog.id }}
                  key={changelog.id}
                >
                  <Card className="max-w-56 min-w-56 w-full h-36 hover:border-emerald-700 transition">
                    <CardHeader className="flex items-center justify-center">
                      <CardTitle>{changelog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center flex-col">
                      <span>Versions: {changelog.computed?.versionCount}</span>

                      <span>Commits: {changelog.computed?.commitCount}</span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}

          <Link to="/changelog/create">
            <Card className="max-w-56 min-w-56 w-full h-36 hover:border-emerald-700 transition">
              <CardHeader className="flex items-center justify-center">
                <CardTitle>New Changelog</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <PlusCircleIcon strokeWidth={1.5} className="w-10 h-10" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}

export const Route = createLazyFileRoute('/changelog/')({
  component: Component,
})
