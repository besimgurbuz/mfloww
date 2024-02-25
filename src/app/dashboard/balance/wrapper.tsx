"use client"

import { useTransactions, useTransactionStatistics } from "@/lib/db/hooks"
import { BalanceCard } from "@/components/dashboard/balance/balance-card"
import { NoDataCard } from "@/components/no-data-card"

export function BalanceWrapper() {
  const { allEntries, incomes, expenses } = useTransactions()
  const { balance } = useTransactionStatistics()

  if (allEntries.length === 0) {
    return <NoDataCard />
  }

  return (
    <>
      <BalanceCard balance={balance} incomes={incomes} expenses={expenses} />
    </>
  )
}
