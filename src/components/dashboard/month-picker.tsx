"use client"

import { useEffect, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

import { MONTH_ABREVVESIONS } from "@/lib/definitions"
import { createDateFromMonthYear } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type MonthYearPickerProps = {
  defaultValue: string | number | Date
  className?: string
  onChange: (change: Date) => void
}

export function MonthYearPicker({
  className,
  defaultValue,
  onChange,
}: MonthYearPickerProps) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState<number>()

  useEffect(() => {
    const date = new Date(defaultValue)
    setYear(date.getFullYear())
    setMonth(date.getMonth())
  }, [defaultValue])

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setYear(year - 1)
              if (month !== undefined) {
                onChange(createDateFromMonthYear(month, year))
              }
            }}
            disabled={year <= currentYear - 10}
            className="w-7 h-7"
          >
            <ChevronLeftIcon />
          </Button>
          <h3 className="text-sm font-medium">{year}</h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setYear(year + 1)
              if (month !== undefined) {
                onChange(createDateFromMonthYear(month, year))
              }
            }}
            disabled={year >= currentYear}
            className="w-7 h-7"
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
            onChange(createDateFromMonthYear(intValue, year))
          }}
        >
          {MONTH_ABREVVESIONS.map((m, index) => (
            <ToggleGroupItem
              key={m}
              value={index.toString()}
              className="whitespace-nowrap text-xs sm:text-sm"
            >
              {m}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}
