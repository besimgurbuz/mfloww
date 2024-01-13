"use client"

import { useEffect, useRef, useState } from "react"
import { cva } from "class-variance-authority"

import { Entry } from "@/lib/definitions"
import { cn, formatMoney } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { RegularEntryIndicator } from "../regular-entry-indicator"
import { EntryRowListProps } from "./entry-row-list"

interface EntryRowProps {
  entry: Entry
  widthPercentage: number
  direction: EntryRowListProps["direction"]
}

const entryRowVariants = cva(
  "relative order-1 transition-[width] relative h-12 max-w-[95%] flex gap-2 items-center px-2 border-2 bg-muted",
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
  const [rowWidth, setRowWidth] = useState(0)

  useEffect(() => {
    if (!rowRef.current) return

    const resizeObservable = new ResizeObserver(() => {
      if (rowRef.current?.offsetWidth !== rowWidth) {
        setRowWidth(rowRef.current?.offsetWidth || 0)
      }
    })

    resizeObservable.observe(rowRef.current)

    return () => resizeObservable.disconnect()
  }, [rowRef.current])

  return (
    <div
      className={cn("w-full flex items-center gap-2", {
        "justify-end": direction === "rtl",
      })}
    >
      <ContextMenu>
        <ContextMenuTrigger
          ref={rowRef}
          className={cn(entryRowVariants({ type: entry.type, direction }))}
          style={{
            width: `${widthPercentage}%`,
          }}
        >
          <p
            className={cn("text-lg max-w-[200px] truncate", {
              "justify-self-center": rowWidth < 200,
            })}
          >
            {entry.name}
          </p>
          <p
            className={cn(
              "font-medium text-lg",
              direction === "rtl" ? "mr-auto" : "ml-auto",
              {
                hidden: rowWidth < 200,
              }
            )}
          >
            {formatMoney(entry.amount, entry.currency)}
          </p>
          <Popover>
            <PopoverTrigger className="absolute z-10 w-full h-full left-0 top-0"></PopoverTrigger>
            <PopoverContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-md">{entry.name}</h3>
                  <p className="font-medium text-md">
                    {formatMoney(entry.amount, entry.currency)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.createdAt}
                  </p>
                </div>
                {entry.category && (
                  <Badge
                    variant="outline"
                    className={cn("border-muted-foreground")}
                  >
                    <p className="text-xs truncate">{entry.category}</p>
                  </Badge>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="font-medium flex justify-between">
            Edit
          </ContextMenuItem>
          <ContextMenuItem className="font-medium flex justify-between">
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
        <div
          className={cn("flex order-2 gap-2", {
            "flex-row-reverse order-1": direction === "rtl",
          })}
        >
          <p
            className={cn("hidden font-medium text-lg", {
              flex: rowWidth < 200,
            })}
          >
            {formatMoney(entry.amount, entry.currency)}
          </p>
          {entry.isRegular && (
            <RegularEntryIndicator
              type={entry.type}
              className={cn("text-muted-foreground")}
            />
          )}
        </div>
      </ContextMenu>
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
