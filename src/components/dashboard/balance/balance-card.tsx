"use client"

import { useState } from "react"

import { SupportedCurrencyCode } from "@/lib/definitions"
import { Transaction } from "@/lib/transaction"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { TransactionRowList } from "./transaction-row-list"

type DisplayMode = "together" | "grouped"

export function BalanceCard({
  incomes,
  expenses,
  baseCurrency,
}: {
  incomes: Transaction[]
  expenses: Transaction[]
  baseCurrency: SupportedCurrencyCode
}) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grouped")

  return (
    <Card className="w-full">
      <CardHeader className="flex sm:items-center sm:flex-row gap-2 w-full">
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
            <TransactionRowList
              data={expenses}
              baseCurrency={baseCurrency}
              direction="rtl"
              className="order-2 sm:order-1 sm:w-1/2 sm:max-w-1/2"
            />
            <TransactionRowList
              data={incomes}
              baseCurrency={baseCurrency}
              className="order-1 sm:order-2 sm:w-1/2 sm:max-w-1/2"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <TransactionRowList
              data={incomes.concat(expenses)}
              baseCurrency={baseCurrency}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
