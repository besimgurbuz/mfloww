"use client"

import { useEntries, useEntriesStatistics } from "@/lib/db/hooks"
import { DataTableCard } from "@/components/dashboard/data-table-card"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { NoDataCard } from "@/components/no-data-card"

export function DashboardWrapper() {
  const { allEntries, incomes, expenses } = useEntries()
  const statistics = useEntriesStatistics()

  if (allEntries.length === 0) {
    return <NoDataCard />
  }

  return (
    <>
      <SummaryCards {...statistics} />
      <DataTableCard
        allEntries={allEntries}
        incomes={incomes}
        expenses={expenses}
      />
    </>
  )
}
