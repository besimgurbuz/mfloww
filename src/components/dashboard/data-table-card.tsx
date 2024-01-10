"use client"

import { useState } from "react"

import { Entry } from "@/lib/definitions"
import { cn, formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

const data: Entry[] = [
  {
    amount: 4500,
    name: "income #1",
    currency: "USD",
    isRegular: true,
    type: "revenue",
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    amount: 1500,
    name: "expense #1",
    currency: "EUR",
    isRegular: false,
    type: "expense",
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    amount: 50,
    name: "expense #2",
    currency: "USD",
    isRegular: true,
    type: "expense",
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    amount: 45,
    name: "income #2",
    currency: "USD",
    isRegular: false,
    type: "revenue",
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    amount: 300,
    name: "expense #3",
    currency: "USD",
    isRegular: false,
    type: "expense",
    createdAt: new Date().toLocaleTimeString(),
  },
]

type Props = {
  data: {
    revenuesCount: number
    expenseCount: number
  }
}

type DataTableFilter = "revenues" | "expenses" | null

export function DataTableCard({
  data: { revenuesCount, expenseCount },
}: Props) {
  const [filter, setFilter] = useState<DataTableFilter>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenues and expenses</CardTitle>
        <p className="text-sm text-muted-foreground">
          You have {revenuesCount} incomes and {expenseCount} expenses this
          month.
        </p>
      </CardHeader>
      <CardContent className="grid w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center w-full py-2">
            <div
              className={cn(
                "text-muted-foreground w-12",
                item.isRegular ? "opacity-0" : "opacity-100"
              )}
              title="Regular"
            >
              <Icons.repeat className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h2>{item.name}</h2>
              <p className="text-sm text-muted-foreground">{item.createdAt}</p>
            </div>
            <h2 className="font-medium text-lg ml-auto">
              {formatMoney(item.amount, item.currency)}
            </h2>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
