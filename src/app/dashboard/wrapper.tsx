"use client"

import { useContext } from "react"

import { useTransactionStatistics } from "@/lib/db/hooks"
import { DashboardStateContext } from "@/components/dashboard/dashboard-state-context"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { TransactionTableCard } from "@/components/dashboard/transaction-table-card"
import { NoDataCard } from "@/components/no-data-card"

export function DashboardWrapper() {
  const { entryTransactions, entryIncomes, entryExpenses } = useContext(
    DashboardStateContext
  )
  const statistics = useTransactionStatistics()

  if (entryTransactions.length === 0) {
    return <NoDataCard />
  }

  return (
    <>
      <SummaryCards {...statistics} />
      <TransactionTableCard
        transactions={entryTransactions}
        incomes={entryIncomes}
        expenses={entryExpenses}
      />
    </>
  )
}
