import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@boring.tools/ui'
import { PlusCircleIcon } from 'lucide-react'
import { ChangelogVersionCreateStep01 } from './Step01'

export const ChangelogVersionCreate = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <PlusCircleIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How would you like to create your version?</DialogTitle>
          <DialogDescription>
            You can create your version manually. You have to make every entry
            yourself. However, if you want to create your changelog attachment
            from your commit messages, select the automatic option.
          </DialogDescription>
        </DialogHeader>

        <ChangelogVersionCreateStep01 />
      </DialogContent>
    </Dialog>
  )
}
