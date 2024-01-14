import { BalanceCard } from "@/components/dashboard/balance/balance-card"
import { CreateEntryCard } from "@/components/dashboard/balance/create-entry-card"

export default function Balance() {
  return (
    <div className="custom-min-h custom-container flex flex-col gap-2">
      <BalanceCard />
      <CreateEntryCard />
    </div>
  )
}
