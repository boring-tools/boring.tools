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
import { useNavigate } from '@tanstack/react-router'
import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { useChangelogRemove } from '../../hooks/useChangelog'

export const ChangelogDelete = ({ id }: { id: string }) => {
  const remove = useChangelogRemove()
  const navigate = useNavigate({ from: `/changelog/${id}` })
  const [isOpen, setIsOpen] = useState(false)

  const removeChangelog = () => {
    remove.mutate(
      { id },
      {
        onSuccess: () => {
          setIsOpen(false)
          navigate({ to: '/changelog' })
        },
      },
    )
  }
  return (
    <Tooltip>
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant={'ghost'} onClick={() => setIsOpen(true)}>
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
                Remove
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TooltipContent>
        <p>Remove</p>
      </TooltipContent>
    </Tooltip>
  )
}
