"use client"

import { useContext } from "react"

import { useTransactionStatistics } from "@/lib/local-db/hooks"
import { DashboardStateContext } from "@/components/dashboard/dashboard-state-context"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { TransactionTableCard } from "@/components/dashboard/transaction-table-card"
import { NoDataCard } from "@/components/no-data-card"

export function DashboardWrapper() {
  const { selectedEntry, entryTransactions, entryIncomes, entryExpenses } =
    useContext(DashboardStateContext)
  const statistics = useTransactionStatistics()

  if (!selectedEntry || entryTransactions.length === 0) {
    return <NoDataCard isEntrySelected={!!selectedEntry} />
  }

  return (
    <>
      <SummaryCards {...statistics} />
      <TransactionTableCard
        selectedEntry={selectedEntry!}
        transactions={entryTransactions}
        incomes={entryIncomes}
        expenses={entryExpenses}
      />
    </>
  )
}
