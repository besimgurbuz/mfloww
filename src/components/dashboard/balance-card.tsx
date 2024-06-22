import { SupportedCurrencyCode } from "@/lib/definitions"
import TransactionStatistics from "@/lib/transaction/statistics"
import { formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardContext } from "@/app/dashboard/dashboard-context"

import { MontlyDifference } from "./montly-difference"

type BalanceCardProps = {
  base: SupportedCurrencyCode
  montlyDifference: DashboardContext["montlyDifference"]
  statistics: Omit<TransactionStatistics, "setTransactions" | "setBaseCurrency">
}

export function BalanceCard({
  base,
  montlyDifference,
  statistics,
}: BalanceCardProps) {
  const { balance, income, expense } = statistics
  const { incomeDiff, expenseDiff } = montlyDifference
  return (
    <Card>
      <CardHeader className="flex flex-col space-y-0">
        <CardTitle>Balance</CardTitle>
        <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">
          {formatMoney(balance, base)}
        </h2>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <div>
          <h2 className="font-bold">Incomes</h2>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl md:text-2xl font-bold whitespace-nowrap">
              {formatMoney(income.total, base)}
            </h3>
            {incomeDiff && <MontlyDifference difference={incomeDiff} />}
          </div>
        </div>
        <div>
          <h2 className="font-bold">Expenses</h2>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl md:text-2xl font-bold whitespace-nowrap">
              {formatMoney(expense.total, base)}
            </h3>
            {expenseDiff && <MontlyDifference difference={expenseDiff} />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
