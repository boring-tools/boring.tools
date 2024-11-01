import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@boring.tools/ui'
import { PlusCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ChangelogVersionCreateStep01 } from './Step01'
import { ChangelogVersionCreateStep02 } from './Step02'

export const ChangelogVersionCreate = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const nextStep = () => setStep((prev) => prev + 1)

  useEffect(() => {
    if (!isOpen) {
      setStep(1)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={(state) => setIsOpen(state)}>
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

        {step === 1 && <ChangelogVersionCreateStep01 nextStep={nextStep} />}
        {step === 2 && <ChangelogVersionCreateStep02 />}
      </DialogContent>
    </Dialog>
  )
}
