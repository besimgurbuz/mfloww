"use client"

import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

import { Entry, MONTH_ABREVVESIONS } from "@/lib/definitions"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function MonthYearPicker({
  className,
  onChange,
}: {
  className?: string
  onChange: (change: Entry) => void
}) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState<number>()

  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setYear(year - 1)
              if (month !== undefined) {
                onChange({ month, year })
              }
            }}
            disabled={year <= currentYear - 10}
          >
            <ChevronLeftIcon />
          </Button>
          <h2 className="font-medium">{year}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setYear(year + 1)
              if (month !== undefined) {
                onChange({ month, year })
              }
            }}
            disabled={year >= currentYear}
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <ToggleGroup
          className="grid grid-cols-4"
          type="single"
          value={month?.toString()}
          onValueChange={(value) => {
            const intValue = Number(value || month)
            setMonth(intValue)
            onChange({ month: intValue, year })
          }}
        >
          {MONTH_ABREVVESIONS.map((m, index) => (
            <ToggleGroupItem
              key={m}
              value={index.toString()}
              className="font-bold"
            >
              {m}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}
