"use client"

import { useEffect, useState } from "react"

import { SupportedCurrencyCode } from "@/lib/definitions"
import { Transaction } from "@/lib/transaction"
import { cn } from "@/lib/utils"

import { TransactionRow } from "./transaction-row"

export interface TransactionRowListProps {
  data: Transaction[]
  baseCurrency: SupportedCurrencyCode
  direction?: "ltr" | "rtl"
  className?: string
}

export function TransactionRowList({
  data,
  baseCurrency,
  className,
  direction,
}: TransactionRowListProps) {
  const [total, setTotal] = useState<number>()

  useEffect(() => {
    setTotal(
      data.reduce(
        (acc: number, item) =>
          acc + Math.abs((item.exchangeRate[baseCurrency] || 1) * item.amount),
        0
      )
    )
  }, [data, baseCurrency])

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {data.map((item, i) => (
        <TransactionRow
          key={i}
          baseCurrency={baseCurrency}
          transaction={item}
          widthPercentage={
            (Math.abs((item.exchangeRate[baseCurrency] || 1) * item.amount) /
              (total || 1)) *
            100
          }
          direction={direction || "ltr"}
        />
      ))}
      <h3
        className={cn("font-semibold text-lg uppercase pt-2", {
          "self-end": direction === "rtl",
        })}
      ></h3>
    </div>
  )
}
