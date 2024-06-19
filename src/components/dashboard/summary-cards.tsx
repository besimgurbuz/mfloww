"use client"

import { useEffect, useState } from "react"

import { SupportedCurrencyCode } from "@/lib/definitions"
import TransactionStatistics from "@/lib/transaction/statistics"
import { cn, formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardContext } from "@/app/dashboard/dashboard-context"

import { MontlyDifference } from "./montly-difference"

type SummaryCardsProps = Omit<
  TransactionStatistics,
  "setTransactions" | "setBaseCurrency"
> & {
  base: SupportedCurrencyCode
  montlyDifference: DashboardContext["montlyDifference"]
}

export function SummaryCards({
  base,
  montlyDifference,
  ...statistics
}: SummaryCardsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SummaryCardsContent
          {...statistics}
          base={base}
          montlyDifference={montlyDifference}
        />
      </CardContent>
    </Card>
  )
}

function SummaryCardsContent({
  base,
  montlyDifference: { incomeDiff, expenseDiff },
  ...statistics
}: SummaryCardsProps) {
  const { balance, income, expense, spendingMap } = statistics
  const [spendingsByCategory, setSpendingsByCategory] = useState<
    { category: string; amount: number }[]
  >([])

  useEffect(() => {
    setSpendingsByCategory(
      Object.entries(spendingMap)
        .sort(([, a], [, b]) => b - a)
        .map(([category, amount]) => ({ category, amount }))
    )
  }, [base, spendingMap])

  return (
    <>
      <div>
        <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">
          {formatMoney(balance, base)}
        </h2>
      </div>
      <div className="grid gap-2 sm:grid-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle>Total incomes</CardTitle>
          </CardHeader>
          <CardContent className="mt-auto flex flex-col gap-2">
            <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">
              {formatMoney(income.total, base)}
            </h2>
            {incomeDiff && <MontlyDifference difference={incomeDiff} />}
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent className="mt-auto flex flex-col gap-2">
            <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">
              {formatMoney(expense.total, base)}
            </h2>
            {expenseDiff && <MontlyDifference difference={expenseDiff} />}
          </CardContent>
        </Card>
        {spendingsByCategory.length > 0 && (
          <Card className="sm:col-span-2">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <CardTitle>Spendings by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-24">
                <div className="grid gap-2">
                  {spendingsByCategory.map(({ category, amount }, index) => (
                    <div
                      key={category}
                      className={cn("flex justify-between text-sm", {
                        "text-md font-medium": index === 0,
                      })}
                    >
                      <p className="truncate">{category}</p>
                      <p>{formatMoney(amount, base)}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
