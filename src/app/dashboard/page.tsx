import { DataTableCard } from "@/components/dashboard/data-table-card"
import { SummaryCards } from "@/components/dashboard/summary-cards"

export default function Dashboard() {
  const summaryData = {
    balance: 11000,
    totalRevenues: 38000,
    totalExpenses: 27000,
    revenueAvgDiffOfYear: 20.1,
    expenseAvgDiffOfYear: -20.3,
    revenueCount: 3,
    expenseCount: 38,
    mostSpentCategory: "Electronics",
    mostSpentCategoryCount: 10,
    currency: "EUR",
  } as Parameters<typeof SummaryCards>["0"]["data"]

  return (
    <div className="custom-container custom-min-h">
      <div className="flex flex-col gap-2 pt-4">
        <h3 className="font-bold text-xl md:text-2xl pb-2">
          Overview of April 2024
        </h3>
        <SummaryCards data={summaryData} />
        <DataTableCard data={{ revenuesCount: 3, expenseCount: 38 }} />
      </div>
    </div>
  )
}
