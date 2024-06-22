"use client"

import { useContext, useState } from "react"
import { PlusIcon } from "@radix-ui/react-icons"

import { useMediaQuery, useTransactionStatistics } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { CommandShortcut } from "@/components/ui/command"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { BarChartCard } from "@/components/dashboard/bar-chart/bar-chart-card"
import { CreateUpdateTransaction } from "@/components/dashboard/create-update-transaction"
import { DateSelector } from "@/components/dashboard/date-selector"
import { SpendingsByCategoryCard } from "@/components/dashboard/spendings-by-category"
import { TransactionTableCard } from "@/components/dashboard/transaction-table-card"
import { DashboardStateContext } from "@/app/dashboard/dashboard-context"

import { useUser } from "../user-context"

export function DashboardWrapper() {
  const {
    baseCurrency,
    selectedDate,
    entryTransactions,
    entryIncomes,
    entryExpenses,
    montlyDifference,
    setSelectedDate,
  } = useContext(DashboardStateContext)
  const { user } = useUser()
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
                className="px-2 h-16 w-16 fixed bottom-8 right-8 md:h-8 md:w-8 md:relative md:bottom-0 md:right-0 z-10"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <BalanceCard
          base={baseCurrency}
          montlyDifference={montlyDifference}
          statistics={statistics}
        />
        <SpendingsByCategoryCard
          base={baseCurrency}
          spendingMap={statistics.spendingMap}
        />
      </div>
      <TransactionTableCard
        transactions={entryTransactions}
        incomes={entryIncomes}
        expenses={entryExpenses}
        baseCurrency={baseCurrency}
      />
      <BarChartCard
        baseCurrency={baseCurrency}
        allTransactions={entryTransactions}
        incomes={entryIncomes}
        expenses={entryExpenses}
      />
    </>
  )
}
