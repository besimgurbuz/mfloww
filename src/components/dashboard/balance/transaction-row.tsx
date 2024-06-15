"use client"

import { useEffect, useRef, useState } from "react"
import { cva } from "class-variance-authority"

import { SupportedCurrencyCode } from "@/lib/definitions"
import { useFormattedTransactionAmount } from "@/lib/hooks"
import { Transaction } from "@/lib/transaction"
import { cn, formatMoney } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"

import { TransactionMenu } from "../transaction-menu"
import { TransactionRowListProps } from "./transaction-row-list"

interface TransactionRowProps {
  transaction: Transaction
  widthPercentage: number
  baseCurrency: SupportedCurrencyCode
  direction: TransactionRowListProps["direction"]
}

const transactionRowVariants = cva(
  "relative select-none order-1 transition-[width] relative h-12 max-w-[95%] flex gap-2 items-center px-2 border-2 bg-muted",
  {
    variants: {
      type: {
        income: "",
        expense: "",
      },
      direction: {
        rtl: "rounded-l order-2 flex-row-reverse",
        ltr: "rounded-r",
      },
    },
    compoundVariants: [
      {
        type: "income",
        direction: "rtl",
        class: "border-l-green",
      },
      {
        type: "expense",
        direction: "rtl",
        class: "border-l-red",
      },
      {
        type: "income",
        direction: "ltr",
        class: "border-r-green",
      },
      {
        type: "expense",
        direction: "ltr",
        class: "border-r-red",
      },
    ],
  }
)

export function TransactionRow({
  transaction,
  widthPercentage,
  baseCurrency,
  direction,
}: TransactionRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [rowWidth, setRowWidth] = useState(0)
  const { amount, realAmount } = useFormattedTransactionAmount(
    transaction,
    baseCurrency
  )

  useEffect(() => {
    if (!rowRef.current) return

    const resizeObservable = new ResizeObserver(() => {
      if (rowRef.current?.offsetWidth !== rowWidth) {
        setRowWidth(rowRef.current?.offsetWidth || 0)
      }
    })

    resizeObservable.observe(rowRef.current)

    return () => resizeObservable.disconnect()
  }, [rowRef, rowWidth])

  return (
    <div
      className={cn(
        "w-full flex items-center gap-2 text-sm sm:text-md md:text-lg",
        {
          "justify-end": direction === "rtl",
        }
      )}
    >
      <TransactionMenu
        type="context-menu"
        transaction={transaction}
        trigger={
          <div
            ref={rowRef}
            className={cn(
              transactionRowVariants({ type: transaction.type, direction })
            )}
            style={{
              width: `${widthPercentage}%`,
            }}
          >
            <p
              className={cn("truncate", {
                "justify-self-center": rowWidth < 200,
                hidden: rowWidth < 50,
              })}
            >
              {transaction.name}
            </p>
            <div
              className={cn(
                "whitespace-nowrap flex flex-col",
                direction === "rtl" ? "mr-auto" : "ml-auto",
                {
                  hidden: rowWidth < 200,
                }
              )}
            >
              <h3 className="text-lg font-medium">{amount}</h3>
              {realAmount && (
                <p className="text-muted-foreground text-xs">{realAmount}</p>
              )}
            </div>
            <Popover>
              <PopoverTrigger className="absolute z-10 w-full h-full left-0 top-0"></PopoverTrigger>
              <PopoverContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-md">{transaction.name}</h3>
                    <p className="font-medium text-md whitespace-nowrap">
                      {formatMoney(transaction.amount, transaction.currency)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    {transaction.isRegular && (
                      <Icons.repeat className="w-4 h-4 text-muted-foreground" />
                    )}
                    {transaction.category && (
                      <div className="flex flex-wrap">
                        {transaction.category
                          .split(",")
                          .map((category, idx) => (
                            <Badge key={idx} variant="outline">
                              <p className="text-xs truncate">
                                {category.trim()}
                              </p>
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        }
      />
      <div
        className={cn("flex order-2 gap-2", {
          "flex-row-reverse order-1": direction === "rtl",
        })}
      >
        <p
          className={cn("hidden font-medium truncate items-center", {
            flex: rowWidth < 50,
          })}
        >
          {transaction.name}
        </p>
        <div
          className={cn("hidden flex-col whitespace-nowrap", {
            flex: rowWidth < 200,
          })}
        >
          <h3 className="text-lg font-medium">{amount}</h3>
          {realAmount && (
            <p className="text-muted-foreground text-xs">{realAmount}</p>
          )}
        </div>
      </div>
    </div>
  )
}
