import { useEffect, useMemo, useState } from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { Transaction } from "@/lib/transaction"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MonthYearPicker } from "./month-picker"

type DateSelectorProps = {
  defaultValue: Transaction["date"]
  onValueChange: (value: Transaction["date"]) => void
}

type TransactionDateTypes = "one-time" | "recurring" | "infinite"

export function TransactionDateSelector({
  defaultValue,
  onValueChange,
}: DateSelectorProps) {
  const [dateType, setDateType] = useState<TransactionDateTypes>("one-time")

  return (
    <Tabs
      defaultValue={dateType}
      onValueChange={(val) => setDateType(val as TransactionDateTypes)}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="one-time">One-time</TabsTrigger>
        <TabsTrigger value="recurring">Recurring</TabsTrigger>
        <TabsTrigger value="infinite">Infinite</TabsTrigger>
      </TabsList>
      <TabsContent value="one-time">
        <SingleDatePicker
          defaultValue={new Date()}
          onValueChange={console.log}
        />
      </TabsContent>
    </Tabs>
  )
}

type SingleDatePickerProps = {
  defaultValue: Date
  onValueChange: (d: Date) => void
}

function SingleDatePicker({
  defaultValue,
  onValueChange,
}: SingleDatePickerProps) {
  const [date, setDate] = useState<Date>()
  const [enableCalendar, setEnableCalendar] = useState(false)
  const dateFormat = useMemo(() => {
    if (enableCalendar) {
      return "PPP"
    }
    return "MMMM yyyy"
  }, [enableCalendar])

  useEffect(() => {
    setDate(defaultValue)
  }, [defaultValue])

  const handleSelect = (value: Date | undefined) => {
    onValueChange(value as Date)
    setDate(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col w-auto p-2" align="start">
        {enableCalendar && (
          <Calendar
            mode="single"
            required
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        )}
        {!enableCalendar && (
          <MonthYearPicker
            defaultValue={defaultValue}
            onChange={handleSelect}
          />
        )}
        <Button
          variant="outline"
          onClick={() => setEnableCalendar((val) => !val)}
        >
          {enableCalendar ? "Select as month" : "Select as date"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
