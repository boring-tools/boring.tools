import { Button } from '@boring.tools/ui'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { AccessTokenColumns } from '../components/AccessToken/Table/Columns'
import { DataTable } from '../components/AccessToken/Table/DataTable'
import { PageWrapper } from '../components/PageWrapper'
import { useAccessTokenList } from '../hooks/useAccessToken'

const Component = () => {
  const { data, isPending } = useAccessTokenList()

  return (
    <PageWrapper
      breadcrumbs={[
        {
          name: 'Access tokens',
          to: '/access-tokens',
        },
      ]}
    >
      <div className="flex w-full gap-5 justify-between items-start md:items-center flex-col md:flex-row">
        <h1 className="text-3xl">Access Tokens</h1>

        <Button asChild>
          <Link to="/access-tokens/new">Generate new token</Link>
        </Button>
      </div>
      {data && !isPending && (
        <DataTable data={data} columns={AccessTokenColumns} />
      )}
    </PageWrapper>
  )
}

export const Route = createLazyFileRoute('/access-tokens/')({
  component: Component,
})
