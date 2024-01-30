"use client"

import { useEffect, useState } from "react"

import { useAllEntries } from "@/lib/db/hooks"
import { Entry, EntryType } from "@/lib/definitions"
import { cn, formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Icons } from "../icons"

type DataTableFilter = EntryType | "all"

export function DataTableCard() {
  const entries = useAllEntries()
  const [filter, setFilter] = useState<DataTableFilter>("all")
  const [displayedEntries, setDisplayedEntries] = useState<Entry[]>([
    ...entries,
  ])
  const [totalInfo, setTotalInfo] = useState({
    income: 0,
    expense: 0,
  })

  useEffect(() => {
    if (filter === "all") {
      setDisplayedEntries([...entries])
    } else {
      setDisplayedEntries(entries.filter((item) => item.type === filter))
    }
  }, [filter, entries])

  useEffect(() => {
    let totalIncome = 0
    let totalExpense = 0
    for (const entry of entries) {
      if (entry.type === "income") {
        totalIncome++
      } else {
        totalExpense++
      }
    }
    setTotalInfo({
      income: totalIncome,
      expense: totalExpense,
    })
  }, [entries])

  return (
    <Card>
      <CardHeader className="flex sm:flex-row">
        <div>
          <CardTitle>Incomes and expenses</CardTitle>
          <p className="text-sm text-muted-foreground">
            You have {totalInfo.income} incomes and {totalInfo.expense} expenses
            this month.
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
          <ToggleGroupItem value="all" className="text-xs sm:text-sm">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="income" className="text-xs sm:text-sm">
            Incomes
          </ToggleGroupItem>
          <ToggleGroupItem value="expense" className="text-xs sm:text-sm">
            Expenses
          </ToggleGroupItem>
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
              <Icons.repeat className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <h2>{item.name}</h2>
              <p className="text-sm text-muted-foreground">{item.date}</p>
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
