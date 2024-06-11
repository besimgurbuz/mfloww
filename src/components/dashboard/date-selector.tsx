"use client"

import { useMemo } from "react"
import {
  CaretLeftIcon,
  CaretRightIcon,
  CounterClockwiseClockIcon,
} from "@radix-ui/react-icons"

import { MONTH_NAMES } from "@/lib/definitions"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DateSelectorProps = {
  selectedDate: string
  setSelectedDate: (newDate: string) => void
}

export function DateSelector({
  selectedDate,
  setSelectedDate,
}: DateSelectorProps) {
  const displayName = useMemo(() => {
    const [selectedMonth, selectedYear] = selectedDate.split("_")
    return `${MONTH_NAMES[Number(selectedMonth)]} ${selectedYear}`
  }, [selectedDate])
  const showTurnBack = useMemo(() => {
    const currentDate = new Date()
    const [selectedMonth, selectedYear] = selectedDate.split("_")

    return (
      Number(selectedYear) != currentDate.getFullYear() ||
      Number(selectedMonth) != currentDate.getMonth()
    )
  }, [selectedDate])

  function increaseDate() {
    const [selectedMonth, selectedYear] = selectedDate.split("_")
    const date = new Date(Number(selectedYear), Number(selectedMonth) + 1)
    setSelectedDate(`${date.getMonth()}_${date.getFullYear()}`)
  }

  function decreaseDate() {
    const [selectedMonth, selectedYear] = selectedDate.split("_")
    const date = new Date(Number(selectedYear), Number(selectedMonth) - 1)
    setSelectedDate(`${date.getMonth()}_${date.getFullYear()}`)
  }

  function setBackToCurrentDate() {
    const currentDate = new Date()
    setSelectedDate(`${currentDate.getMonth()}_${currentDate.getFullYear()}`)
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-2 items-center border">
        <Button variant="ghost" onClick={decreaseDate}>
          <CaretLeftIcon className="w-5 h-5" />
        </Button>
        <h2 className="font-medium">{displayName}</h2>
        <Button variant="ghost" onClick={increaseDate}>
          <CaretRightIcon className="w-5 h-5" />
        </Button>
      </div>
      {showTurnBack && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={setBackToCurrentDate}>
                <CounterClockwiseClockIcon className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to current month</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
