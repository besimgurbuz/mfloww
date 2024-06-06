"use client"

import { useContext } from "react"

import { useTransactionStatistics } from "@/lib/local-db/hooks"
import { BalanceCard } from "@/components/dashboard/balance/balance-card"
import { DashboardStateContext } from "@/components/dashboard/dashboard-state-context"
import { NoDataCard } from "@/components/no-data-card"

export function BalanceWrapper() {
  const { selectedEntry, entryTransactions, entryIncomes, entryExpenses } =
    useContext(DashboardStateContext)
  const { balance } = useTransactionStatistics()

  if (!selectedEntry || entryTransactions.length === 0) {
    return <NoDataCard isEntrySelected={!!selectedEntry} />
  }

  return (
    <>
      <BalanceCard
        balance={balance}
        incomes={entryIncomes}
        expenses={entryExpenses}
      />
    </>
  )
}
