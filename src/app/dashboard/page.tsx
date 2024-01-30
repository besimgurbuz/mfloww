import { DataTableCard } from "@/components/dashboard/data-table-card"
import { SummaryCards } from "@/components/dashboard/summary-cards"

export default function Dashboard() {
  const summaryData = {
    balance: 11000,
    totalIncome: 38000,
    totalExpense: 27000,
    incomeAvgDiffOfYear: 20.1,
    expenseAvgDiffOfYear: -20.3,
    incomeCount: 3,
    expenseCount: 38,
    mostSpentCategory: "Electronics",
    mostSpentCategoryCount: 10,
    currency: "EUR",
  } as Parameters<typeof SummaryCards>["0"]["data"]

  return (
    <div className="custom-container custom-min-h">
      <div className="flex flex-col gap-2 pt-4">
        <SummaryCards data={summaryData} />
        <DataTableCard data={{ incomeCount: 3, expenseCount: 38 }} />
      </div>
    </div>
  )
}
