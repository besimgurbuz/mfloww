"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { MonthSelectionCommand } from "./month-selection-command"

export function DashboardNav() {
  const pathname = usePathname()
  const routes: { path: string; name: string }[] = [
    { path: "/dashboard", name: "Balance" },
    { path: "/dashboard/graphics", name: "Graphics" },
  ]

  return (
    <nav className="custom-container flex items-center w-full h-14 sticky top-14 space-x-4 lg:space-x-8">
      <MonthSelectionCommand />
      {routes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={cn(
            "font-medium transition-colors hover:text-primary text-muted-foreground",
            pathname === route.path && "text-white"
          )}
        >
          {route.name}
        </Link>
      ))}
    </nav>
  )
}
