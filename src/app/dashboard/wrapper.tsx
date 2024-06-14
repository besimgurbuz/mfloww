"use client"

import { useContext, useState } from "react"
import { PlusIcon } from "@radix-ui/react-icons"

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
import { DateSelector } from "@/components/dashboard/date-selector"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { TransactionTableCard } from "@/components/dashboard/transaction-table-card"
import { DashboardStateContext } from "@/app/dashboard/dashboard-context"

export function DashboardWrapper() {
  const {
    selectedDate,
    entryTransactions,
    entryIncomes,
    entryExpenses,
    setSelectedDate,
  } = useContext(DashboardStateContext)
  const statistics = useTransactionStatistics()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [createTransactionOpen, setCreateTransactionOpen] = useState(false)

  return (
    <>
      <div className="flex justify-center md:justify-between ">
        <DateSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
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
          open={createTransactionOpen}
          onOpenChange={setCreateTransactionOpen}
        />
      </div>
      <SummaryCards {...statistics} />
      <BalanceCard incomes={entryIncomes} expenses={entryExpenses} />
      <TransactionTableCard
        transactions={entryTransactions}
        incomes={entryIncomes}
        expenses={entryExpenses}
      />
    </>
  )
}
