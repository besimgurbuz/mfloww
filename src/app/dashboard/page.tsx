import { DataTableCard } from "@/components/dashboard/data-table-card"
import { SummaryCards } from "@/components/dashboard/summary-cards"

export default function Dashboard() {
  return (
    <div className="custom-container custom-min-h">
      <div className="flex flex-col gap-2 pt-4">
        <SummaryCards />
        <DataTableCard />
      </div>
    </div>
  )
}
