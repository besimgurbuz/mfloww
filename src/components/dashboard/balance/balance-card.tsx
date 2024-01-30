"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Entry } from "@/lib/definitions"
import { formatMoney } from "@/lib/utils"

import { EntryRowList } from "./entry-row-list"

const incomes: Entry[] = [
  {
    amount: 4500,
    name: "income #1",
    currency: "USD",
    isRegular: true,
    type: "income",
    date: new Date().toLocaleDateString(),
    exchangeRate: {} as Entry['exchangeRate'],
  },
  {
    amount: 45,
    name: "income #2income #2income #2income #2income #2income #2income #2",
    currency: "USD",
    category: "app revenue",
    isRegular: false,
    type: "income",
    date: new Date().toLocaleDateString(),
    exchangeRate: {} as Entry['exchangeRate'],
  },
  {
    amount: 45,
    name: "income #3",
    currency: "USD",
    category: "other",
    isRegular: false,
    type: "income",
    date: new Date().toLocaleDateString(),
    exchangeRate: {} as Entry['exchangeRate'],
  },
]

const expenses: Entry[] = [
  {
    amount: 1500,
    name: "expense #1",
    currency: "EUR",
    category: "rent",
    isRegular: false,
    type: "expense",
    date: new Date().toLocaleDateString(),
    exchangeRate: {} as Entry['exchangeRate'],
  },
  {
    amount: 50,
    name: "expense #2",
    currency: "USD",
    category: "food",
    isRegular: true,
    type: "expense",
    date: new Date().toLocaleDateString(),
    exchangeRate: {} as Entry['exchangeRate'],
  },
  {
    amount: 300,
    name: "expense #3",
    currency: "USD",
    category: "electronics",
    isRegular: false,
    type: "expense",
    date: new Date().toLocaleDateString(),
    exchangeRate: {} as Entry['exchangeRate'],
  },
]

type DisplayMode = "together" | "grouped"

export function BalanceCard() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("together")
  return (
    <Card className="w-full">
      <CardHeader className="flex sm:items-center sm:flex-row gap-2 w-full">
        <div>
          <CardTitle className="uppercase">
            {formatMoney(2000, "USD")}
          </CardTitle>
          <p className="text-sm pt-2 text-muted-foreground">
            With {incomes.length} incomes and {expenses.length} expenses.
          </p>
        </div>
        <ToggleGroup
          type="single"
          className="ml-auto"
          value={displayMode}
          onValueChange={(value: DisplayMode) =>
            setDisplayMode(value || displayMode)
          }
        >
          <ToggleGroupItem value="together">Combined</ToggleGroupItem>
          <ToggleGroupItem value="grouped">Grouped</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="flex flex-col w-full gap-4 max-w-full">
        {displayMode === "grouped" ? (
          <div className="flex w-full gap-2 flex-wrap sm:flex-nowrap">
            <EntryRowList
              data={expenses}
              currency="USD"
              direction="rtl"
              className="order-2 sm:order-1 sm:w-1/2 sm:max-w-1/2"
            />
            <EntryRowList
              data={incomes}
              currency="USD"
              className="order-1 sm:order-2 sm:w-1/2 sm:max-w-1/2"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <EntryRowList
              data={incomes
                .concat(expenses)
                .sort((a, b) => a.amount - b.amount)}
              currency="USD"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
