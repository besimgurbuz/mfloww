"use client"

import { useState } from "react"

import { Transaction, TransactionType } from "@/lib/transaction"
import { cn, formatMoney } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Icons } from "../icons"
import { TransactionMenu } from "../transaction-menu"

type DataTableFilter = TransactionType | "all"

export function TransactionTableCard({
  transactions,
  incomes,
  expenses,
}: {
  transactions: Transaction[]
  incomes: Transaction[]
  expenses: Transaction[]
}) {
  const [filter, setFilter] = useState<DataTableFilter>("all")

  return (
    <Card>
      <CardHeader className="flex sm:flex-row">
        <div>
          <CardTitle>Incomes and expenses</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            You have {incomes.length} income{incomes.length > 1 && "s"} and{" "}
            {expenses.length} expense{expenses.length > 1 && "s"}
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
          transactions={transactions}
          incomes={incomes}
          expenses={expenses}
        />
      </CardContent>
    </Card>
  )
}

function DataTableCardContent({
  filter,
  transactions,
  incomes,
  expenses,
}: {
  filter: DataTableFilter
  transactions: Transaction[]
  incomes: Transaction[]
  expenses: Transaction[]
}) {
  if (filter === "all") {
    return (
      <>
        {transactions.map((transaction, idx) => (
          <DataTableTransactionItem key={idx} transaction={transaction} />
        ))}
      </>
    )
  } else if (filter === "income") {
    return (
      <>
        {incomes.map((transaction, idx) => (
          <DataTableTransactionItem key={idx} transaction={transaction} />
        ))}
      </>
    )
  }

  return (
    <>
      {expenses.map((transaction, idx) => (
        <DataTableTransactionItem key={idx} transaction={transaction} />
      ))}
    </>
  )
}

function DataTableTransactionItem({
  transaction,
}: {
  transaction: Transaction
}) {
  return (
    <div className="flex items-center w-full py-2 gap-4">
      <div
        className={cn(
          "text-muted-foreground w-4",
          transaction.isRegular ? "opacity-100" : "opacity-0"
        )}
      >
        <Icons.repeat className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col min-w-fit">
        <h2>{transaction.name}</h2>
        <p className="text-sm text-muted-foreground">{transaction.date}</p>
      </div>
      <div className="flex gap-1 flex-wrap">
        {transaction.category?.split(",")?.map((category, idx) => (
          <Badge key={idx} variant="outline">
            {category.trim()}
          </Badge>
        ))}
      </div>
      <h2 className="font-medium text-lg ml-auto whitespace-nowrap">
        {formatMoney(transaction.amount, transaction.currency)}
      </h2>
      <TransactionMenu transaction={transaction} />
    </div>
  )
}
