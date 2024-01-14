"use client"

import { Entry, SupportedCurrencyCode } from "@/lib/definitions"
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
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {data.map((item, i) => (
        <EntryRow
          key={i}
          entry={item}
          widthPercentage={30 * (Math.random() + 1)}
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
