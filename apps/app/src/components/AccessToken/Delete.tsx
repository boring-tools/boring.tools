import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@boring.tools/ui'
import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { useAccessTokenDelete } from '../../hooks/useAccessToken'

export const AccessTokenDelete = ({ id }: { id: string }) => {
  const accessTokenDelete = useAccessTokenDelete()
  const [isOpen, setIsOpen] = useState(false)

  const removeChangelog = () => {
    accessTokenDelete.mutate(
      { id },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      },
    )
  }
  return (
    <Tooltip>
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost-destructive'}
              onClick={() => setIsOpen(true)}
            >
              <Trash2Icon strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              changelog and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={removeChangelog} variant={'destructive'}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TooltipContent>
        <p>Delete access token</p>
      </TooltipContent>
    </Tooltip>
  )
}
