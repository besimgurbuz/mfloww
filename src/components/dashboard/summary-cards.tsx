"use client"

import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons"

import { SupportedCurrencyCode } from "@/lib/definitions"
import TransactionStatistics from "@/lib/transaction/statistics"
import { formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SummaryCardsProps = Omit<
  TransactionStatistics,
  "setTransactions" | "spendingMap" | "setBaseCurrency"
> & { base: SupportedCurrencyCode }

export function SummaryCards({ base, ...statistics }: SummaryCardsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SummaryCardsContent {...statistics} base={base} />
      </CardContent>
    </Card>
  )
}

function SummaryCardsContent({ base, ...statistics }: SummaryCardsProps) {
  const { balance, income, expense, mostSpent } = statistics

  return (
    <>
      <div>
        <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">
          {formatMoney(balance, base)}
        </h2>
      </div>
      <div className="grid gap-2 sm:grid-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle>Total incomes</CardTitle>
            <TriangleUpIcon className="w-6 h-6 text-green ml-auto" />
          </CardHeader>
          <CardContent>
            <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">
              {formatMoney(income.total, base)}
            </h2>
            {/* TODO: Add average statistics */}
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
              {formatMoney(expense.total, base)}
            </h2>
            {/* TODO: Add average statistics */}
          </CardContent>
        </Card>
        {mostSpent.category && (
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle>Most Spent Category</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl md:text-2xl font-bold">
                {mostSpent.category}
              </h2>
              <p className="text-sm text-muted-foreground whitespace-nowrap">
                {formatMoney(mostSpent.amount, base)} has spent
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
