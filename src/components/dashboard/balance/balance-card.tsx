"use client"

import { useState } from "react"

import { Entry } from "@/lib/entry"
import { formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { EntryRowList } from "./entry-row-list"

type DisplayMode = "together" | "grouped"

export function BalanceCard({
  balance,
  incomes,
  expenses,
}: {
  balance: number
  incomes: Entry[]
  expenses: Entry[]
}) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("together")

  return (
    <Card className="w-full">
      <CardHeader className="flex sm:items-center sm:flex-row gap-2 w-full">
        <div>
          <CardTitle className="uppercase whitespace-nowrap">
            {formatMoney(balance, "USD")}
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
            <EntryRowList data={incomes.concat(expenses)} currency="USD" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
