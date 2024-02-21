"use client"

import { useState } from "react"

import { Entry, EntryType } from "@/lib/entry"
import { cn, formatMoney } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { EntryMenu } from "../entry-menu"
import { Icons } from "../icons"

type DataTableFilter = EntryType | "all"

export function DataTableCard({
  allEntries,
  incomes,
  expenses,
}: {
  allEntries: Entry[]
  incomes: Entry[]
  expenses: Entry[]
}) {
  const [filter, setFilter] = useState<DataTableFilter>("all")

  return (
    <Card>
      <CardHeader className="flex sm:flex-row">
        <div>
          <CardTitle>Incomes and expenses</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            You have {incomes.length} incomes and {expenses.length} expenses
            this month.
          </p>
        </div>
        <ToggleGroup
          type="single"
          defaultValue="all"
          value={filter}
          className="ml-auto"
          onValueChange={(value: DataTableFilter) =>
            setFilter((prevFilter) => value || prevFilter)
          }
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
      <CardContent className="grid w-full relative overflow-x-auto">
        <DataTableCardContent
          filter={filter}
          allEntries={allEntries}
          incomes={incomes}
          expenses={expenses}
        />
      </CardContent>
    </Card>
  )
}

function DataTableCardContent({
  filter,
  allEntries,
  incomes,
  expenses,
}: {
  filter: DataTableFilter
  allEntries: Entry[]
  incomes: Entry[]
  expenses: Entry[]
}) {
  if (filter === "all") {
    return (
      <>
        {allEntries.map((entry, idx) => (
          <DataTableEntryItem key={idx} entry={entry} />
        ))}
      </>
    )
  } else if (filter === "income") {
    return (
      <>
        {incomes.map((entry, idx) => (
          <DataTableEntryItem key={idx} entry={entry} />
        ))}
      </>
    )
  }

  return (
    <>
      {expenses.map((entry, idx) => (
        <DataTableEntryItem key={idx} entry={entry} />
      ))}
    </>
  )
}

function DataTableEntryItem({ entry }: { entry: Entry }) {
  return (
    <div className="flex items-center w-full py-2 gap-4">
      <div
        className={cn(
          "text-muted-foreground w-4",
          entry.isRegular ? "opacity-100" : "opacity-0"
        )}
      >
        <Icons.repeat className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col min-w-fit">
        <h2>{entry.name}</h2>
        <p className="text-sm text-muted-foreground">{entry.date}</p>
      </div>
      <div className="flex gap-1 flex-wrap">
        {entry.category?.split(",")?.map((category, idx) => (
          <Badge key={idx} variant="outline">
            {category.trim()}
          </Badge>
        ))}
      </div>
      <h2 className="font-medium text-lg ml-auto whitespace-nowrap">
        {formatMoney(entry.amount, entry.currency)}
      </h2>
      <EntryMenu entry={entry} />
    </div>
  )
}
