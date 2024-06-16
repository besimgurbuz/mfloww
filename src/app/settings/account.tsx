"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { useServerAction } from "@/lib/hooks"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon, Icons } from "@/components/icons"
import { useUser } from "@/app/user-context"

import { useToast } from "../../components/ui/use-toast"

export function Account() {
  const { user, syncUser } = useUser()
  const [name, setName] = useState(user?.name)
  const { toast } = useToast()
  const { deleteAllTransactions } = useDeleteAllTransactionsQuery()
  const router = useRouter()

  const updateUserName = async () =>
    await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
  const deleteAccount = async () => {
    await deleteAllTransactions()
    return await fetch("/api/user", {
      method: "DELETE",
    })
  }

  const [dispatchUpdate, isPendingUpdate] = useServerAction(updateUserName, {
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [dispatchDeleteAccount, isPendingDeleteAccount] = useServerAction(
    deleteAccount,
    {
      onFinished: (response) => {
        if (response?.ok) {
          toast({
            title: "Account deleted",
            description: "Your account has been deleted successfully",
          })
          syncUser()
          router.push("/sign-in")
        } else {
          toast({
            title: "Failed to delete account",
            description: "An error occured while trying to delete your account",
            variant: "destructive",
            duration: 30000,
          })
        }
      },
    }
  )

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {user?.provider && (
            <Icon name={user.provider as any} className="w-5 h-5" />
          )}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex flex-col gap-2 flex-1 min-w-40">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button
              disabled={name?.trim() === user?.name.trim() || isPendingUpdate}
              onClick={dispatchUpdate}
              className="flex gap-2 w-fit self-end"
            >
              {isPendingUpdate && (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              )}
              Save username
            </Button>
          </div>
          {user?.email && (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input disabled id="email" type="email" value={user?.email} />
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-col gap-2">
              <Label>Account deletion</Label>
              <p className="text-muted-foreground text-sm">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger className="w-fit">
                <Button variant="destructive" className="w-fit">
                  Delete account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete your account?
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  This action cannot be reversed.
                </DialogDescription>
                <DialogFooter className="gap-2">
                  <DialogClose>Cancel</DialogClose>
                  <Button
                    variant="destructive"
                    onClick={dispatchDeleteAccount}
                    className="w-fit flex gap-2"
                  >
                    {isPendingDeleteAccount && (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    )}
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
