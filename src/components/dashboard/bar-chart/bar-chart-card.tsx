"use client"

import { SupportedCurrencyCode } from "@/lib/definitions"
import { useStorage } from "@/lib/hooks"
import { Transaction } from "@/lib/transaction"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { BarList } from "./bar-list"

type DisplayMode = "together" | "grouped"

type BarChartCardProps = {
  allTransactions: Transaction[]
  incomes: Transaction[]
  expenses: Transaction[]
  baseCurrency: SupportedCurrencyCode
}

export function BarChartCard({
  allTransactions,
  incomes,
  expenses,
  baseCurrency,
}: BarChartCardProps) {
  const [displayMode, setDisplayMode] = useStorage<DisplayMode>(
    "GRAPH_DISPLAY_MODE",
    "localStorage",
    "grouped"
  )

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
            <BarList
              data={expenses}
              baseCurrency={baseCurrency}
              direction="rtl"
              className="order-2 sm:order-1 sm:w-1/2 sm:max-w-1/2"
            />
            <BarList
              data={incomes}
              baseCurrency={baseCurrency}
              className="order-1 sm:order-2 sm:w-1/2 sm:max-w-1/2"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <BarList data={allTransactions} baseCurrency={baseCurrency} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
