"use client"

import { useRef } from "react"
import { cva } from "class-variance-authority"

import { Entry } from "@/lib/definitions"
import { cn, formatMoney } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import { RepeatingEntryIndicator } from "../repating-entry-indicator"
import { EntryRowListProps } from "./entry-row-list"

interface EntryRowProps {
  entry: Entry
  widthPercentage: number
  direction: EntryRowListProps["direction"]
}

const entryRowVariants = cva(
  "overflow-hidden order-1 transition-[width] w-0 relative h-12 min-w-0 flex gap-2 items-center justify-between px-2 border-2 bg-muted",
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

export function EntryRow({ entry, widthPercentage, direction }: EntryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn("w-full flex items-center gap-2", {
        "justify-end": direction === "rtl",
      })}
    >
      <div
        ref={rowRef}
        className={cn(entryRowVariants({ type: entry.type, direction }))}
        style={{
          width: `${widthPercentage}%`,
        }}
      >
        <p className={cn("text-lg min-w-[100px] max-w-[200px] truncate")}>
          {entry.name}
        </p>
        {entry.category && (
          <Badge variant="outline">
            <p className="text-xs truncated max-w-12 truncate">
              {entry.category}
            </p>
          </Badge>
        )}
        <p className={cn("font-medium text-lg")}>
          {formatMoney(entry.amount, entry.currency)}
        </p>
        {entry.isRegular && (
          <RepeatingEntryIndicator
            type={entry.type}
            className="text-muted-foreground"
          />
        )}
      </div>
    </div>
  )
}

function canFit(
  rowWidth?: number,
  targetWidth?: number,
  siblingsWidth?: number
): boolean {
  if (!rowWidth || !targetWidth) return true

  return targetWidth + (siblingsWidth || 0) < rowWidth
}
