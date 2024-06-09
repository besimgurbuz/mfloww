import { useEffect } from "react"
import { signOut } from "firebase/auth"

import { auth } from "@/lib/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserState } from "@/app/user-context"

export function UserDropdown({ user }: { user: UserState | null }) {
  useEffect(() => {
    const down = async (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      } else if (e.key === "o" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        await signOut(auth)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!user) {
    return <></>
  }

  const { email, image, name } = user
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={image || undefined} />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button className="w-full text-start">Log out</button>
          <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
