"use client"

import { useTransactions, useTransactionStatistics } from "@/lib/db/hooks"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { TransactionTableCard } from "@/components/dashboard/transaction-table-card"
import { NoDataCard } from "@/components/no-data-card"

export function DashboardWrapper() {
  const { transactions, incomes, expenses } = useTransactions()
  const statistics = useTransactionStatistics()

  if (transactions.length === 0) {
    return <NoDataCard />
  }

  return (
    <>
      <SummaryCards {...statistics} />
      <TransactionTableCard
        transactions={transactions}
        incomes={incomes}
        expenses={expenses}
      />
    </>
  )
}
