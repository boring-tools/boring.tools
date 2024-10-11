import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Button,
} from '@boring.tools/ui'
import { useNavigate } from '@tanstack/react-router'
import { TriangleAlertIcon } from 'lucide-react'
import { useState } from 'react'
import { useChangelogVersionRemove } from '../../hooks/useChangelog'

export const ChangelogVersionDelete = ({
  id,
  versionId,
}: { id: string; versionId: string }) => {
  const remove = useChangelogVersionRemove()
  const navigate = useNavigate({ from: `/changelog/${id}` })
  const [isOpen, setIsOpen] = useState(false)

  const removeChangelogVersion = () => {
    remove.mutate(
      { id: versionId },
      {
        onSuccess: () => {
          setIsOpen(false)
          navigate({ to: '/changelog/$id', params: { id } })
        },
      },
    )
  }
  return (
    <Alert className="mt-10 max-w-screen-md" variant={'destructive'}>
      <TriangleAlertIcon className="h-4 w-4" />
      <AlertTitle>Danger Zone</AlertTitle>
      <AlertDescription className="inline-flex flex-col gap-3">
        You can remove your version here. You cannot undo this.
        <AlertDialog open={isOpen}>
          <AlertDialogTrigger asChild>
            <Button
              size={'sm'}
              variant={'destructive'}
              onClick={() => setIsOpen(true)}
            >
              Remove version
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                version and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={removeChangelogVersion}
                  variant={'destructive'}
                >
                  Remove
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AlertDescription>
    </Alert>
  )
}
