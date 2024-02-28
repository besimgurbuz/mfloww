"use client"

import { useContext, useEffect, useState } from "react"
import { DialogTrigger } from "@radix-ui/react-dialog"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { useCreateEntryQuery } from "@/lib/db/hooks"
import { Entry } from "@/lib/definitions"
import { useMediaQuery } from "@/lib/hooks"
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
import { DashboardStateContext } from "@/components/dashboard/dashboard-state-context"

import { MonthYearPicker } from "./month-picker"

export function EntrySelectionCommand() {
  const { entries, selectedEntry, setSelectedEntry } = useContext(
    DashboardStateContext
  )
  const { createEntry } = useCreateEntryQuery()
  const [open, setOpen] = useState(false)
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
            {selectedEntry ? selectedEntry.name : "Select an entry"}
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
                  key={entry.name}
                  value={entry.name}
                  aria-selected={selectedEntry?.name === entry.name}
                  onSelect={() => {
                    setSelectedEntry(entry.name)
                    setOpen(false)
                  }}
                >
                  {entry.name}

                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedEntry?.name === entry.name
                        ? "opacity-100"
                        : "opacity-0"
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
        onSubmit={async (entry) => {
          try {
            await createEntry(entry)
            setOpen(false)
            setShowNewEntryModal(false)
            setSelectedEntry(entry.name)
          } catch (err) {
            console.error(err)
          }
        }}
      />
    </>
  )
}

type NewEntryDialogOrDrawerProps = {
  open: boolean
  setOpen: (state: boolean) => void
  onSubmit: (monthYear: Omit<Entry, "userId">) => void
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
