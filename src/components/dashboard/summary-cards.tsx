"use client"

import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons"

import { SupportedCurrencyCode } from "@/lib/definitions"
import { formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  data: {
    balance: number
    totalIncome: number
    totalExpense: number
    incomeAvgDiffOfYear: number
    expenseAvgDiffOfYear: number
    incomeCount: number
    expenseCount: number
    mostSpentCategory: string
    mostSpentCategoryCount: number
    currency: SupportedCurrencyCode
  }
}

export function SummaryCards({
  data: {
    balance,
    totalIncome,
    totalExpense: totalExpenses,
    incomeAvgDiffOfYear,
    expenseAvgDiffOfYear,
    incomeCount,
    expenseCount,
    mostSpentCategory,
    mostSpentCategoryCount,
    currency,
  },
}: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            {formatMoney(balance, currency)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {incomeCount} incomes, {expenseCount} expenses
          </p>
        </div>
        <div className="grid gap-2 sm:grid-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle>Total incomes</CardTitle>
              <TriangleUpIcon className="w-6 h-6 text-green ml-auto" />
            </CardHeader>
            <CardContent>
              <h2 className="text-xl md:text-2xl font-bold">
                {formatMoney(totalIncome, currency)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {`${incomeAvgDiffOfYear > 0 ? "+" : ""}${incomeAvgDiffOfYear}`}{" "}
                from average of this year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle>Total Expenses</CardTitle>
              <TriangleDownIcon className="w-6 h-6 text-red ml-auto" />
            </CardHeader>
            <CardContent>
              <h2 className="text-xl md:text-2xl font-bold">
                {formatMoney(totalExpenses, currency)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {`${
                  expenseAvgDiffOfYear > 0 ? "+" : ""
                }${expenseAvgDiffOfYear}`}{" "}
                from average of this year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle>Most Spent Category</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl md:text-2xl font-bold">
                {mostSpentCategory}
              </h2>
              <p className="text-sm text-muted-foreground">
                +{mostSpentCategoryCount - 1} different expenses
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
