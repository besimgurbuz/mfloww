"use client"

import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons"

import TransactionStatistics from "@/lib/transaction/statistics"
import { formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SummaryCards(
  statistics: Omit<TransactionStatistics, "setTransactions" | "spendingMap">
) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SummaryCardsContent {...statistics} />
      </CardContent>
    </Card>
  )
}

function SummaryCardsContent(
  statistics: Omit<TransactionStatistics, "setTransactions" | "spendingMap">
) {
  const { balance, income, expense, mostSpent } = statistics

  return (
    <>
      <div>
        <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">
          {formatMoney(balance, "USD")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {income.count} incomes, {expense.count} expenses
        </p>
      </div>
      <div className="grid gap-2 sm:grid-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle>Total incomes</CardTitle>
            <TriangleUpIcon className="w-6 h-6 text-green ml-auto" />
          </CardHeader>
          <CardContent>
            <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">
              {formatMoney(income.total, "USD")}
            </h2>
            {/* TODO: Add statistics */}
            {/* <p className="text-sm text-muted-foreground">
                {incomeAvg} average
              </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle>Total Expenses</CardTitle>
            <TriangleDownIcon className="w-6 h-6 text-red ml-auto" />
          </CardHeader>
          <CardContent>
            <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">
              {formatMoney(expense.total, "USD")}
            </h2>
            {/* TODO: Add statistics */}
            {/* <p className="text-sm text-muted-foreground">
                {expenseAvg} average
              </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle>Most Spent Category</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl md:text-2xl font-bold">
              {mostSpent.category}
            </h2>
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {formatMoney(mostSpent.amount, "USD")} has spent
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
