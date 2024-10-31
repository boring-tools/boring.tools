import { Card, CardContent, CardHeader, CardTitle } from '@boring.tools/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { PlusCircleIcon } from 'lucide-react'
import { PageWrapper } from '../components/PageWrapper'
import { usePageList } from '../hooks/usePage'

const Component = () => {
  const { data, isPending } = usePageList()

  return (
    <PageWrapper
      breadcrumbs={[
        {
          name: 'Page',
          to: '/page',
        },
      ]}
    >
      <h1 className="text-3xl">Page</h1>
      <div className="flex gap-10 w-full flex-wrap">
        {!isPending &&
          data &&
          data.map((page) => {
            return (
              <Link to="/page/$id" params={{ id: page.id }} key={page.id}>
                <Card className="max-w-56 min-w-56 w-full h-36 hover:border-emerald-700 transition">
                  <CardHeader className="flex items-center justify-center">
                    <CardTitle>{page.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}

        <Link to="/page/create">
          <Card className="max-w-56 min-w-56 w-full h-36 hover:border-emerald-700 transition">
            <CardHeader className="flex items-center justify-center">
              <CardTitle>New page</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <PlusCircleIcon strokeWidth={1.5} className="w-10 h-10" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageWrapper>
  )
}

export const Route = createLazyFileRoute('/page/')({
  component: Component,
})
