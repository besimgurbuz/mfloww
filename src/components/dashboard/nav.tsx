"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusIcon } from "@radix-ui/react-icons"

import { useMediaQuery } from "@/lib/hooks"
import { cn } from "@/lib/utils"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { CreateUpdateTransaction } from "./create-update-transaction"
import { EntrySelectionCommand } from "./entry-selection-command"

export function DashboardNav() {
  const pathname = usePathname()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [createTransactionOpen, setCreateTransactionOpen] = useState(false)
  const routes: { path: string; name: string }[] = [
    { path: "/dashboard", name: "Overview" },
    { path: "/dashboard/balance", name: "Balance" },
    { path: "/dashboard/graphics", name: "Graphics" },
  ]

  return (
    <nav className="custom-container flex items-center w-full h-14 sticky z-50 top-0 md:top-14 space-x-4 lg:space-x-8 bg-background">
      <Sheet>
        <div className="flex gap-2 w-full md:w-fit pr-2">
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" className="px-2 h-8">
              <Icons.menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <EntrySelectionCommand />
        </div>
        <div className="hidden items-center space-x-4 lg:space-x-6 md:flex">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "font-medium transition-colors hover:text-primary text-muted-foreground",
                pathname === route.path && "text-text"
              )}
            >
              {route.name}
            </Link>
          ))}
        </div>
        <div className="!ml-auto flex items-center gap-2">
          <Button
            onClick={() => setCreateTransactionOpen(true)}
            className="px-2 h-8"
          >
            <PlusIcon className="w-5 h-5" />
          </Button>
          <CreateUpdateTransaction
            isDesktop={isDesktop}
            mode="create"
            open={createTransactionOpen}
            onOpenChange={setCreateTransactionOpen}
          />
          <SheetContent className="flex flex-col" side="left">
            <SheetTitle className="flex gap-2">
              <Icons.logo className="w-6 h-6" />
              mfloww
            </SheetTitle>
            {routes.map((route) => (
              <SheetClose key={route.path} asChild>
                <Link
                  href={route.path}
                  className={cn(
                    "font-medium transition-colors text-lg active:text-primary text-muted-foreground",
                    pathname === route.path && "text-text"
                  )}
                >
                  {route.name}
                </Link>
              </SheetClose>
            ))}
          </SheetContent>
        </div>
      </Sheet>
    </nav>
  )
}
