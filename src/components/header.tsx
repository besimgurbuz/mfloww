"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Icons } from "@/components/icons"

import { ThemeModeToggle } from "./theme-mode-toggle"
import { UserDropdown } from "./user-dropdown"

export function Header() {
  const { status, data } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background backdrop-blur">
      <div className="custom-container w-full flex h-14  items-center">
        <NavigationMenu className="max-w-full flex justify-between">
          <NavigationMenuList className="mr-auto">
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink>
                  <div className="flex gap-2 text-xl md:text-2xl font-medium font-sans">
                    <Icons.logo className="w-6 h-6 md:w-8 md:h-8"></Icons.logo>
                    mfloww
                  </div>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            {status === "unauthenticated" ? (
              <>
                <NavigationMenuItem>
                  <Link href="/sign-in" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} text-lg`}
                    >
                      Sign in
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="https://github.com/besimgurbuz/mfloww"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="ghost" size="icon">
                      <Icons.gitHub className="h-4 w-4 md:h-6 md:w-6" />
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink>
                    <ThemeModeToggle />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            ) : (
              <UserDropdown user={data?.user} />
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
