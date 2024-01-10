"use client"

import { useEffect, useState } from "react"
import { DialogTrigger } from "@radix-ui/react-dialog"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { MONTH_NAMES } from "@/lib/definitions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { MonthYearPicker } from "./month-picker"

export function MonthSelectionCommand() {
  const [entries, setEntries] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<string>()
  const [createdEntry, setCreatedEntry] = useState<{
    month: number
    year: number
  }>()
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-[300px]"
          >
            {selectedEntry ? selectedEntry : "Select an entry"}
            <CommandShortcut>/</CommandShortcut>
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search entry..." />
            <CommandEmpty>No entry found.</CommandEmpty>
            <CommandGroup heading="Entries">
              {entries.map((entry) => (
                <CommandItem
                  key={entry}
                  value={entry}
                  onSelect={() => {
                    setSelectedEntry(entry)
                    setOpen(false)
                  }}
                >
                  {entry}

                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedEntry === entry ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
              <DialogTrigger asChild>
                <CommandItem
                  value="create entry"
                  className="flex gap-2"
                  onSelect={() => {
                    setOpen(false)
                    setShowNewEntryDialog(true)
                  }}
                >
                  <PlusCircledIcon />
                  Create entry
                </CommandItem>
              </DialogTrigger>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Create entry</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Add a new entry based on month and year.
        </DialogDescription>
        <MonthYearPicker
          onChange={(change) => {
            setCreatedEntry({
              ...change,
            })
          }}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setCreatedEntry(undefined)
              setShowNewEntryDialog(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createdEntry === undefined}
            onClick={() => {
              const newEntry = `${
                MONTH_NAMES[createdEntry?.month as number]
              } ${createdEntry?.year}`
              setEntries([...entries, newEntry])
              setCreatedEntry(undefined)
              setOpen(false)
              setShowNewEntryDialog(false)
              setSelectedEntry(newEntry)
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
