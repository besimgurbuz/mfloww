"use client"

import { useState } from "react"
import { TrashIcon } from "@radix-ui/react-icons"

import { useDeleteTransactionQuery } from "@/lib/db/hooks"
import { useMediaQuery, useStorage } from "@/lib/hooks"
import { Transaction } from "@/lib/transaction"
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

import { CreateUpdateTransaction } from "./dashboard/create-update-transaction"
import { Icons } from "./icons"

export function TransactionMenu({ transaction }: { transaction: Transaction }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { deleteTransaction } = useDeleteTransactionQuery()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
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
        <DropdownMenuItem
          className="flex gap-2 w-full font-bold"
          onClick={() => setUpdateOpen(true)}
        >
          <Icons.pencil className="w-4 h-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2 w-full font-bold"
          onClick={async () => {
            if (dontWarnDelete) {
              await deleteTransaction(transaction.id)
              return
            }
            setDeleteOpen(true)
          }}
        >
          <TrashIcon className="w-5 h-5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DeleteWarning
        isDesktop={isDesktop}
        transactionName={transaction.name}
        showWarning={!!dontWarnDelete == false}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSubmit={async () => {
          await deleteTransaction(transaction.id)
        }}
        onNeverAskedChecked={() => setDontWarnDelete(true)}
      />
      <CreateUpdateTransaction
        enableShortcut={false}
        isDesktop={isDesktop}
        mode="edit"
        transaction={transaction}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
      />
    </DropdownMenu>
  )
}

type DeleteWarningProps = {
  isDesktop: boolean
  transactionName: string
  open: boolean
  showWarning: boolean
  onOpenChange: (state: boolean) => void
  onSubmit: () => void
  onNeverAskedChecked: () => void
}

function DeleteWarning({
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
