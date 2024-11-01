import { Link, useParams } from '@tanstack/react-router'
import { HandIcon, WorkflowIcon } from 'lucide-react'

export const ChangelogVersionCreateStep01 = ({
  nextStep,
}: { nextStep: () => void }) => {
  const { id } = useParams({ from: '/changelog/$id' })

  return (
    <div className="flex gap-10 mt-3">
      <button
        type="button"
        className="flex-col hover:border-accent border rounded border-muted p-5 flex items-center justify-center w-full"
        onClick={nextStep}
      >
        <WorkflowIcon />
        Automatic
      </button>
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
