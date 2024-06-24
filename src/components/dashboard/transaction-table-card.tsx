"use client"

import { useMemo, useState } from "react"

import { SupportedCurrencyCode } from "@/lib/definitions"
import { useFormattedTransactionAmount } from "@/lib/hooks"
import { Transaction, TransactionType } from "@/lib/transaction"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Icon, Icons } from "../icons"
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
  const [type, setType] = useState<DataTableFilter>("all")

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
          value={type}
          className="ml-auto"
          onValueChange={(value: DataTableFilter) =>
            setType((prevFilter) => value || prevFilter)
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
        <DataTable
          type={type}
          transactions={transactions}
          baseCurrency={baseCurrency}
        />
      </CardContent>
    </Card>
  )
}

type DataTableProps = {
  transactions: Transaction[]
  baseCurrency: SupportedCurrencyCode
  type: "all" | "income" | "expense"
}

function DataTable({ transactions, baseCurrency, type }: DataTableProps) {
  const [sort, setSort] = useState<{ key: string; order: "asc" | "desc" }>({
    key: "amount",
    order: "desc",
  })
  const typedTransactions = useMemo(() => {
    if (type === "all") {
      return [...transactions]
    }
    return transactions.filter((transaction) => transaction.type === type)
  }, [transactions, type])
  const sortedData = useMemo(() => {
    return typedTransactions.sort((a, b) => {
      if (sort.key === "amount") {
        const aAmount = Math.abs(a.amount * (a.exchangeRate[baseCurrency] || 1))
        const bAmount = Math.abs(b.amount * (b.exchangeRate[baseCurrency] || 1))

        if (sort.order === "asc") {
          return aAmount - bAmount
        } else {
          return bAmount - aAmount
        }
      }

      const aVal = a[sort.key as keyof Transaction] as string | number
      const bVal = b[sort.key as keyof Transaction] as string | number

      if (sort.order === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }, [typedTransactions, sort, baseCurrency])

  const handleSort = (key: string) => {
    if (sort.key === key) {
      setSort((prevSort) => ({
        key: prevSort.key,
        order: prevSort.order === "asc" ? "desc" : "asc",
      }))
    } else {
      setSort({ key, order: "asc" })
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-background">
          <TableHead className="w-[100px]"></TableHead>
          <TableHead
            onClick={() => handleSort("name")}
            className="hover:cursor-pointer"
          >
            <div className="group flex gap-1 items-center">
              Name
              <Icon
                name={
                  sort.key === "name" && sort.order === "desc"
                    ? "arrowDown"
                    : "arrowUp"
                }
                className={cn("group-hover:opacity-100 opacity-0", {
                  "opacity-100": sort.key === "name",
                })}
              />
            </div>
          </TableHead>
          <TableHead
            onClick={() => handleSort("category")}
            className="hover:cursor-pointer"
          >
            <div className="group flex gap-1 items-center">
              Category
              <Icon
                name={
                  sort.key === "category" && sort.order === "desc"
                    ? "arrowDown"
                    : "arrowUp"
                }
                className={cn("group-hover:opacity-100 opacity-0", {
                  "opacity-100": sort.key === "category",
                })}
              />
            </div>
          </TableHead>
          <TableHead
            onClick={() => handleSort("amount")}
            className="hover:cursor-pointer"
          >
            <div className="group flex gap-1 items-center">
              Amount
              <Icon
                name={
                  sort.key === "amount" && sort.order === "desc"
                    ? "arrowDown"
                    : "arrowUp"
                }
                className={cn("group-hover:opacity-100 opacity-0", {
                  "opacity-100": sort.key === "amount",
                })}
              />
            </div>
          </TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((transaction) => (
          <DataTableRow
            key={transaction.id}
            transaction={transaction}
            baseCurrency={baseCurrency}
          />
        ))}
      </TableBody>
    </Table>
  )
}

type DataTableRowProps = {
  transaction: Transaction
  baseCurrency: SupportedCurrencyCode
}

function DataTableRow({ transaction, baseCurrency }: DataTableRowProps) {
  const { amount, realAmount } = useFormattedTransactionAmount(
    transaction,
    baseCurrency
  )
  return (
    <TableRow>
      <TableCell
        className={cn(
          "text-muted-foreground w-4",
          transaction.isRegular ? "opacity-100" : "opacity-0"
        )}
      >
        <Icons.repeat className="w-4 h-4 text-muted-foreground" />
      </TableCell>
      <TableCell>{transaction.name}</TableCell>
      <TableCell>
        {transaction.category && (
          <Badge variant="outline" className="truncate">
            {transaction.category.trim()}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <h2 className="font-medium text-lg truncate">{amount}</h2>
        <h2 className="text-lg text-muted-foreground truncate">{realAmount}</h2>
      </TableCell>
      <TableCell>
        <TransactionMenu
          type="dropdown-menu"
          trigger={
            <Button variant="ghost">
              <Icons.dotsHorizontal />
            </Button>
          }
          transaction={transaction}
        />
      </TableCell>
    </TableRow>
  )
}
