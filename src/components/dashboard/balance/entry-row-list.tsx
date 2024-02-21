"use client"

import { useEffect, useState } from "react"

import { SupportedCurrencyCode } from "@/lib/definitions"
import { Entry } from "@/lib/entry"
import { cn } from "@/lib/utils"

import { EntryRow } from "./entry-row"

export interface EntryRowListProps {
  data: Entry[]
  currency: SupportedCurrencyCode
  direction?: "ltr" | "rtl"
  className?: string
}

export function EntryRowList({
  data,
  className,
  direction,
}: EntryRowListProps) {
  const [total, setTotal] = useState<number>()

  useEffect(() => {
    setTotal(data.reduce((acc: number, item) => acc + item.amount, 0))
  }, [data])

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {data.map((item, i) => (
        <EntryRow
          key={i}
          entry={item}
          widthPercentage={(item.amount / (total || 1)) * 100}
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
