"use client"

import { useContext, useState } from "react"
import { CaretLeftIcon, CaretRightIcon, PlusIcon } from "@radix-ui/react-icons"

import { useMediaQuery } from "@/lib/hooks"
import { useTransactionStatistics } from "@/lib/local-db/hooks"
import { Button } from "@/components/ui/button"
import { CommandShortcut } from "@/components/ui/command"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BalanceCard } from "@/components/dashboard/balance/balance-card"
import { CreateUpdateTransaction } from "@/components/dashboard/create-update-transaction"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { TransactionTableCard } from "@/components/dashboard/transaction-table-card"
import { NoDataCard } from "@/components/no-data-card"
import { DashboardStateContext } from "@/app/dashboard/dashboard-context"

export function DashboardWrapper() {
  const {
    selectedEntry,
    entryTransactions,
    entryIncomes,
    entryExpenses,
    setSelectedEntry,
  } = useContext(DashboardStateContext)
  const statistics = useTransactionStatistics()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [createTransactionOpen, setCreateTransactionOpen] = useState(false)

  if (!selectedEntry || entryTransactions.length === 0) {
    return <NoDataCard isEntrySelected={!!selectedEntry} />
  }

  return (
    <>
      <div className="flex justify-center md:justify-between ">
        <div className="flex gap-2 items-center">
          <Button variant="ghost">
            <CaretLeftIcon className="w-5 h-5" />
          </Button>
          <h2 className="font-medium">{selectedEntry.name}</h2>
          <Button variant="ghost">
            <CaretRightIcon className="w-5 h-5" />
          </Button>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setCreateTransactionOpen(true)}
                className="px-2 h-16 w-16 fixed bottom-8 right-8 md:h-8 md:w-8 md:relative md:bottom-0 md:right-0"
              >
                <PlusIcon className="w-8 h-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex gap-2" side="bottom">
              <p>Create transaction</p>
              <CommandShortcut>⌘K</CommandShortcut>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CreateUpdateTransaction
          enableShortcut={true}
          isDesktop={isDesktop}
          mode="create"
          open={createTransactionOpen}
          onOpenChange={setCreateTransactionOpen}
        />
      </div>
      <SummaryCards {...statistics} />
      <BalanceCard incomes={entryIncomes} expenses={entryExpenses} />
      <TransactionTableCard
        selectedEntry={selectedEntry!}
        transactions={entryTransactions}
        incomes={entryIncomes}
        expenses={entryExpenses}
      />
    </>
  )
}
