"use client"

import { useState } from "react"

import { Entry } from "@/lib/definitions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Icons } from "@/components/icons"

import { EntryRowList } from "./entry-row-list"

const incomes: Entry[] = [
  {
    amount: 4500,
    name: "income #1",
    currency: "USD",
    isRegular: true,
    type: "income",
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    amount: 45,
    name: "income #2income #2income #2income #2income #2income #2income #2",
    currency: "USD",
    category: "app revenue",
    isRegular: false,
    type: "income",
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    amount: 45,
    name: "income #3",
    currency: "USD",
    category: "other",
    isRegular: false,
    type: "income",
    createdAt: new Date().toLocaleTimeString(),
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
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    amount: 50,
    name: "expense #2",
    currency: "USD",
    category: "food",
    isRegular: true,
    type: "expense",
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    amount: 300,
    name: "expense #3",
    currency: "USD",
    category: "electronics",
    isRegular: false,
    type: "expense",
    createdAt: new Date().toLocaleTimeString(),
  },
]

type DisplayMode = "together" | "grouped"

export function BalanceCard() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("together")
  return (
    <Card>
      <CardHeader className="flex sm:items-center sm:flex-row gap-2 w-full">
        <div>
          <CardTitle>Incomes and expenses</CardTitle>
          <p className="text-sm text-muted-foreground">
            You have {incomes.length} incomes and {expenses.length} expenses
            this month.
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
          <ToggleGroupItem value="together">
            <Icons.balanceTogether className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grouped">
            <Icons.balanceGrouped className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground" />
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="flex flex-col w-full gap-4">
        <div className="flex w-full">
          {displayMode === "grouped" ? (
            <div className="flex w-full gap-4 flex-wrap sm:flex-nowrap">
              <EntryRowList
                data={expenses}
                currency="USD"
                direction="rtl"
                className="order-2 sm:order-1"
              />
              <EntryRowList
                data={incomes}
                currency="USD"
                className="order-1 sm:order-2"
              />
            </div>
          ) : (
            <EntryRowList
              data={incomes
                .concat(expenses)
                .sort((a, b) => a.amount - b.amount)}
              currency="USD"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
