"use client"

import { useState } from "react"
import { TrashIcon } from "@radix-ui/react-icons"

import { useDeleteEntryQuery } from "@/lib/db/hooks"
import { Entry } from "@/lib/entry"
import { useMediaQuery, useStorage } from "@/lib/hooks"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "./icons"

export function EntryMenu({ entry }: { entry: Entry }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { deleteEntry } = useDeleteEntryQuery()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [dontWarnDelete, setDontWarnDelete] = useStorage<boolean>(
    "DONT_WARN_DELETE",
    "sessionStorage",
    false
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Icons.dotsHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex gap-2 w-full font-bold">
          <Icons.pencil className="w-4 h-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2 w-full font-bold"
          onClick={async () => {
            if (dontWarnDelete) {
              await deleteEntry(entry.id)
              return
            }
            setOpenDeleteDialog(true)
          }}
        >
          <TrashIcon className="w-5 h-5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DeleteWarning
        isDesktop={isDesktop}
        entryName={entry.name}
        showWarning={!!dontWarnDelete == false}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSubmit={async () => {
          await deleteEntry(entry.id)
        }}
        onNeverAskedChecked={() => setDontWarnDelete(true)}
      />
    </DropdownMenu>
  )
}

type DeleteWarningProps = {
  isDesktop: boolean
  entryName: string
  open: boolean
  showWarning: boolean
  onOpenChange: (state: boolean) => void
  onSubmit: () => void
  onNeverAskedChecked: () => void
}

function DeleteWarning({
  isDesktop,
  entryName,
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
              Are you sure you want to delete {entryName} entry?
            </DialogTitle>
            <DialogDescription>
              <WarningContent />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <DialogClose>Cancel</DialogClose>
            <Button onClick={onConfirm}>Confirm</Button>
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
            Are you sure you want to delete {entryName} entry?
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
