"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function DashboardNav() {
  const pathname = usePathname()
  const routes: { path: string; name: string }[] = [
    { path: "/dashboard/overview", name: "Overview" },
    { path: "/dashboard/graphics", name: "Graphics" },
  ]
  console.log(pathname)

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={cn(
            "font-medium transition-colors hover:text-primary",
            pathname !== route.path && "text-muted-foreground"
          )}
        >
          {route.name}
        </Link>
      ))}
    </nav>
  )
}
