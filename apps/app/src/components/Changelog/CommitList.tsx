import { Card, CardContent, CardHeader, CardTitle } from '@boring.tools/ui'
import { useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { useChangelogCommitList } from '../../hooks/useChangelog'

export const ChangelogCommitList = () => {
  const { id } = useParams({ from: '/changelog/$id' })
  const { data } = useChangelogCommitList({ id, limit: 50 })

  if (data) {
    return (
      <Card className="w-full max-w-screen-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Commits ({data.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            {data?.map((commit) => {
              return (
                <div
                  className="hover:bg-muted py-1 px-2 rounded transition flex gap-2 items-center"
                  key={commit.id}
                >
                  <span className="font-mono font-bold text-muted-foreground">
                    {commit.commit}
                  </span>
                  <p className="w-full">{commit.subject}</p>

                  <span className="text-xs">
                    {format(new Date(commit.author.date), 'dd.MM.yyyy')}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return <div className="flex flex-col gap-5">Not found </div>
}
