"use client"

import { useState } from "react"

import { SUPPORTED_CURRENCY_CODES } from "@/lib/definitions"
import { useStorage } from "@/lib/hooks"
import { useDeleteAllTransactionsQuery } from "@/lib/local-db/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeModeToggle } from "@/components/theme-mode-toggle"

import { DataSync } from "./data-sync"

export function System() {
  const [baseCurrency, setBaseCurrency] = useStorage(
    "SELECTED_BASE_CURRENCY",
    "localStorage",
    "USD"
  )

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { deleteAllTransactions } = useDeleteAllTransactionsQuery()
  const handleDeleteLocalData = async () => {
    await deleteAllTransactions()
    setIsDeleteDialogOpen(false)
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>System</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-col gap-2">
              <Label>Base Currency</Label>
              <p className="text-muted-foreground text-sm">
                The base currency is used to calculate the exchange rates of
                other currencies.
              </p>
            </div>
            <Select
              value={baseCurrency}
              onValueChange={(currency) => setBaseCurrency(currency)}
            >
              <SelectTrigger className="w-fit">
                <SelectValue>{baseCurrency}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCY_CODES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-col gap-2">
              <Label>Delete the data stored in this device</Label>
              <p className="text-muted-foreground text-sm">
                Delete all data stored in this device.
              </p>
            </div>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger className="w-fit">
                <Button variant="destructive" className="w-fit">
                  Delete local data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete all data stored in this
                    device?
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  This action cannot be reversed.
                </DialogDescription>
                <DialogFooter className="gap-2">
                  <DialogClose>Cancel</DialogClose>
                  <Button variant="destructive" onClick={handleDeleteLocalData}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-col gap-2">
              <Label>Language</Label>
              <p className="text-muted-foreground text-sm">
                Multiple language support coming soon!
              </p>
            </div>
            <Select value="en" disabled>
              <SelectTrigger className="w-fit">
                <SelectValue>English</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-col gap-2">
              <Label>Data Sync</Label>
              <p className="text-muted-foreground text-sm">
                Upload your local data or download the latest data stored in the
                cloud.
              </p>
            </div>
            <DataSync />
          </div>
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-col gap-2">
              <Label>Theme</Label>
              <p className="text-muted-foreground text-sm">
                Toggle between light and dark themes.
              </p>
            </div>
            <ThemeModeToggle />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
