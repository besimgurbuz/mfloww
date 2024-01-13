"use client"

import { useEffect, useState } from "react"

import { Entry, EntryType } from "@/lib/definitions"
import { cn, formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { RegularEntryIndicator } from "./regular-entry-indicator"

const data: Entry[] = [
  {
    amount: 4500,
    name: "income #1",
    currency: "USD",
    isRegular: true,
    type: "income",
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
    type: "income",
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
    incomeCount: number
    expenseCount: number
  }
}

type DataTableFilter = EntryType | "all"

export function DataTableCard({ data: { incomeCount, expenseCount } }: Props) {
  const [filter, setFilter] = useState<DataTableFilter>("all")
  const [displayedEntries, setDisplayedEntries] = useState<Entry[]>([...data])

  useEffect(() => {
    if (filter === "all") {
      setDisplayedEntries([...data])
    } else {
      setDisplayedEntries(data.filter((item) => item.type === filter))
    }
  }, [filter])

  return (
    <Card>
      <CardHeader className="flex flex-row">
        <div>
          <CardTitle>Incomes and expenses</CardTitle>
          <p className="text-sm text-muted-foreground">
            You have {incomeCount} incomes and {expenseCount} expenses this
            month.
          </p>
        </div>
        <ToggleGroup
          type="single"
          defaultValue="all"
          value={filter}
          className="ml-auto"
          onValueChange={(value: DataTableFilter) => {
            setFilter(value || filter)
          }}
        >
          <ToggleGroupItem value="income">Incomes</ToggleGroupItem>
          <ToggleGroupItem value="expense">Expenses</ToggleGroupItem>
          <ToggleGroupItem value="all">All</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="grid w-full relative">
        {displayedEntries.map((item, i) => (
          <div key={i} className="flex items-center w-full py-2">
            <div
              className={cn(
                "text-muted-foreground w-12",
                item.isRegular ? "opacity-0" : "opacity-100"
              )}
            >
              <RegularEntryIndicator type={item.type} />
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
