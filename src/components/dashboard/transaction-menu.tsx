"use client"

import { ReactNode, useState } from "react"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { TrashIcon } from "@radix-ui/react-icons"

import { useMediaQuery, useStorage } from "@/lib/hooks"
import { useDeleteTransactionQuery } from "@/lib/local-db/hooks"
import { Transaction } from "@/lib/transaction"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { Icons } from "../icons"
import { CreateUpdateTransaction } from "./create-update-transaction"
import { DeleteWarning } from "./transaction-delete-warning"

type TransactionMenuProps = {
  trigger: ReactNode
  transaction: Transaction
  type: "dropdown-menu" | "context-menu"
}

export function TransactionMenu({
  trigger,
  transaction,
  type,
}: TransactionMenuProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { deleteTransaction } = useDeleteTransactionQuery()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [dontWarnDelete, setDontWarnDelete] = useStorage<boolean>(
    "DONT_WARN_DELETE",
    "sessionStorage",
    false
  )

  if (type === "dropdown-menu") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
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

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          className="flex gap-2 w-full font-bold"
          onClick={() => setUpdateOpen(true)}
        >
          <Icons.pencil className="w-4 h-4" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem
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
        </ContextMenuItem>
      </ContextMenuContent>
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
    </ContextMenu>
  )
}
