import { Link, useParams } from '@tanstack/react-router'
import { HandIcon, WorkflowIcon } from 'lucide-react'

export const ChangelogVersionCreateStep01 = () => {
  const { id } = useParams({ from: '/changelog/$id' })
  return (
    <div className="flex gap-10 mt-3">
      <div className="border rounded border-muted p-5 flex items-center justify-center w-full flex-col">
        <WorkflowIcon />
        Automatic
        <small className="uppercase text-muted-foreground text-xs">
          Coming soon
        </small>
      </div>
      <Link
        className="flex-col hover:border-accent border rounded border-muted p-5 flex items-center justify-center w-full"
        to="/changelog/$id/versionCreate"
        params={{ id }}
      >
        <HandIcon />
        Manual
      </Link>
    </div>
  )
}
