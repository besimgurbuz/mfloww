"use client"

import { useState } from "react"

import { useServerAction } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon, Icons } from "@/components/icons"
import { useUser } from "@/app/user-context"

import { useToast } from "../../components/ui/use-toast"

export function Account() {
  const { user, syncUser } = useUser()
  const { toast } = useToast()
  const [name, setName] = useState(user?.name)

  const updateUserName = async () =>
    await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })

  const [dispatch, isPending] = useServerAction(updateUserName, {
    onFinished: (response) => {
      if (response?.ok) {
        toast({
          title: "Username updated",
          description: "Your username has been updated successfully",
        })
        syncUser()
      } else {
        toast({
          title: "Failed to update username",
          description: "An error occured while trying to update your username",
          variant: "destructive",
          duration: 30000,
        })
      }
    },
  })

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {user?.provider && (
            <Icon name={user.provider as any} className="w-5 h-5" />
          )}
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input disabled id="email" type="email" value={user?.email} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={name?.trim() === user?.name.trim() || isPending}
            onClick={dispatch}
            className="flex gap-2"
          >
            {isPending && <Icons.spinner className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
