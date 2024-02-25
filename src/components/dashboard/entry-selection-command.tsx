"use client"

import { useEffect, useState } from "react"
import { DialogTrigger } from "@radix-ui/react-dialog"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { Entry } from "@/lib/definitions"
import { useMediaQuery } from "@/lib/hooks"
import { cn, formatEntry } from "@/lib/utils"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { MonthYearPicker } from "./month-picker"

export function EntrySelectionCommand() {
  const [entries, setEntries] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<string>()
  const [showNewEntryModal, setShowNewEntryModal] = useState(false)

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
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full md:w-[220px]"
          >
            {selectedEntry ? selectedEntry : "Select an entry"}
            <CommandShortcut>/</CommandShortcut>
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-content p-0" align="start">
          <Command>
            <CommandInput placeholder="Search entry..." />
            <CommandEmpty>No entry found.</CommandEmpty>
            <CommandGroup heading="Entries">
              {entries.map((entry) => (
                <CommandItem
                  key={entry}
                  value={entry}
                  aria-selected={selectedEntry === entry}
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
                    setShowNewEntryModal(true)
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
      <NewEntryDialogOrDrawer
        open={showNewEntryModal}
        setOpen={setShowNewEntryModal}
        onSubmit={(entry) => {
          const newEntry = formatEntry(entry)
          if (entries.includes(newEntry)) {
            setShowNewEntryModal(false)
            return
          }

          setEntries([...entries, newEntry])
          setOpen(false)
          setShowNewEntryModal(false)
          setSelectedEntry(newEntry)
        }}
      />
    </>
  )
}

type NewEntryDialogOrDrawerProps = {
  open: boolean
  setOpen: (state: boolean) => void
  onSubmit: (monthYear: Entry) => void
}

function NewEntryDialogOrDrawer({
  open,
  setOpen,
  onSubmit,
}: NewEntryDialogOrDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [entry, setEntry] = useState<Entry>()

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[350px]">
          <DialogHeader>
            <DialogTitle>Create an entry</DialogTitle>
          </DialogHeader>
          <MonthYearPicker onChange={setEntry} />
          <DialogFooter>
            <Button
              type="submit"
              disabled={entry === undefined}
              onClick={() => {
                onSubmit(entry!)
              }}
            >
              Create
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEntry(undefined)
                setOpen(false)
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>Create an entry</DrawerTitle>
        </DrawerHeader>
        <MonthYearPicker onChange={setEntry} />
        <DrawerFooter>
          <Button
            type="submit"
            disabled={entry === undefined}
            onClick={() => {
              onSubmit(entry!)
            }}
          >
            Create
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setEntry(undefined)
              setOpen(false)
            }}
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
