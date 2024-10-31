import { Card, CardContent, CardHeader, CardTitle } from '@boring.tools/ui'
import { useUser } from '@clerk/clerk-react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { PageWrapper } from '../components/PageWrapper'
import { useStatistic } from '../hooks/useStatistic'

const Component = () => {
  const { data } = useStatistic()
  const user = useUser()
  return (
    <PageWrapper
      breadcrumbs={[
        {
          name: 'Dashboard',
          to: '/',
        },
      ]}
    >
      <h1 className="text-3xl">Welcome back, {user.user?.fullName}</h1>
      <div className="grid w-full max-w-screen-md gap-10 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Changelogs</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data?.changelog.total}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Versions</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data?.changelog.versions.total}
            <div className="text-xs text-muted-foreground tracking-normal flex gap-3">
              <span>{data?.changelog.versions.published} Published</span>
              <span>{data?.changelog.versions.review} Review</span>
              <span>{data?.changelog.versions.draft} Draft</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commits</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data?.changelog.commits.total}
            <div className="text-xs text-muted-foreground tracking-normal flex gap-3">
              <span>{data?.changelog.commits.assigned} Assigned</span>
              <span>{data?.changelog.commits.unassigned} Unassigned</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data?.page.total}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
export const Route = createLazyFileRoute('/')({
  component: Component,
})
