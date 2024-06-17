"use client"

import { useState } from "react"

import { SupportedCurrencyCode } from "@/lib/definitions"
import { useFormattedTransactionAmount } from "@/lib/hooks"
import { Transaction, TransactionType } from "@/lib/transaction"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { TransactionMenu } from "./transaction-menu"

type DataTableFilter = TransactionType | "all"

type TransactionTableCardProps = {
  transactions: Transaction[]
  incomes: Transaction[]
  expenses: Transaction[]
  baseCurrency: SupportedCurrencyCode
}

export function TransactionTableCard({
  transactions,
  incomes,
  expenses,
  baseCurrency,
}: TransactionTableCardProps) {
  const [filter, setFilter] = useState<DataTableFilter>("all")

  return (
    <Card>
      <CardHeader className="flex sm:flex-row">
        <div>
          <CardTitle>Incomes and expenses</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            You have {incomes.length} income{incomes.length > 1 && "s"} and{" "}
            {expenses.length} expense{expenses.length > 1 && "s"}.
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
          baseCurrency={baseCurrency}
        />
      </CardContent>
    </Card>
  )
}

type DataTableCardContentProps = {
  filter: DataTableFilter
  transactions: Transaction[]
  incomes: Transaction[]
  expenses: Transaction[]
  baseCurrency: SupportedCurrencyCode
}

function DataTableCardContent({
  filter,
  transactions,
  incomes,
  expenses,
  baseCurrency,
}: DataTableCardContentProps) {
  return (
    <>
      {filter === "all" && (
        <DataTAbleTransactionList
          transactions={transactions}
          baseCurrency={baseCurrency}
        />
      )}
      {filter === "income" && (
        <DataTAbleTransactionList
          transactions={incomes}
          baseCurrency={baseCurrency}
        />
      )}
      {filter === "expense" && (
        <DataTAbleTransactionList
          transactions={expenses}
          baseCurrency={baseCurrency}
        />
      )}
    </>
  )
}

type DataTableTransactionListProps = {
  transactions: Transaction[]
  baseCurrency: SupportedCurrencyCode
}

function DataTAbleTransactionList({
  transactions,
  baseCurrency,
}: DataTableTransactionListProps) {
  return (
    <>
      {transactions.map((transaction, idx) => (
        <DataTableTransactionItem
          key={idx}
          transaction={transaction}
          baseCurrency={baseCurrency}
        />
      ))}
    </>
  )
}

function DataTableTransactionItem({
  transaction,
  baseCurrency,
}: {
  transaction: Transaction
  baseCurrency: SupportedCurrencyCode
}) {
  const { amount, realAmount } = useFormattedTransactionAmount(
    transaction,
    baseCurrency
  )
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
      </div>
      <div className="flex gap-1 flex-wrap">
        {transaction.category && (
          <Badge variant="outline" className="truncate">
            {transaction.category.trim()}
          </Badge>
        )}
      </div>
      <div className="ml-auto whitespace-nowrap">
        <h2 className="font-medium text-lg">{amount}</h2>
        <p className="text-sm text-muted-foreground text-end">{realAmount}</p>
      </div>
      <TransactionMenu
        type="dropdown-menu"
        trigger={
          <Button variant="ghost">
            <Icons.dotsHorizontal />
          </Button>
        }
        transaction={transaction}
      />
    </div>
  )
}
