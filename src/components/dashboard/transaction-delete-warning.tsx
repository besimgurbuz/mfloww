import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

type DeleteWarningProps = {
  isDesktop: boolean
  transactionName: string
  open: boolean
  showWarning: boolean
  onOpenChange: (state: boolean) => void
  onSubmit: () => void
  onNeverAskedChecked: () => void
}

export function DeleteWarning({
  isDesktop,
  transactionName,
  open,
  onOpenChange,
  showWarning,
  onSubmit,
  onNeverAskedChecked,
}: DeleteWarningProps) {
  function WarningContent() {
    return (
      <div className="w-full h-full flex gap-2 items-center pt-2">
        <Checkbox
          id="never-warn"
          checked={neverAsk}
          onCheckedChange={(checked: boolean) => setNeverAsk(checked)}
        />
        <label htmlFor="never-warn">Don&apos;t ask again</label>
      </div>
    )
  }

  const [neverAsk, setNeverAsk] = useState(false)
  const onConfirm = () => {
    onSubmit()
    onOpenChange(false)

    if (neverAsk) {
      onNeverAskedChecked()
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open && showWarning} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-left">
              Are you sure you want to delete {transactionName}?
            </DialogTitle>
            <DialogDescription>
              <WarningContent />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button onClick={onConfirm}>Confirm</Button>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open && showWarning} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Are you sure you want to delete {transactionName}?
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <WarningContent />
        </div>
        <DrawerFooter>
          <Button onClick={onConfirm}>Confirm</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
