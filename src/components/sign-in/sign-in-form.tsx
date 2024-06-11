"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth"

import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import { Icons } from "../icons"

type SingInProvider = "github" | "google" | "anonymous"

export function SignInForm() {
  const [isPending, setIsPending] = useState(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const router = useRouter()

  const getUserCredentials = async (provider: SingInProvider) => {
    if (provider === "anonymous") {
      return await signInAnonymously(auth)
    }
    const authProvider =
      provider === "github"
        ? new GithubAuthProvider()
        : new GoogleAuthProvider()

    return await signInWithPopup(auth, authProvider)
  }
  const signIn = async (provider: SingInProvider) => {
    setIsPending(true)
    const credentials = await getUserCredentials(provider)
    const idToken = await credentials.user.getIdToken()
    const res = await fetch("/api/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    })

    if (!res.ok) {
      const body = await res.json()
      toast({
        variant: "destructive",
        title: res.statusText,
        description:
          body.error ||
          "An error occured while trying to sign you in, please try again later.",
        duration: 30000,
      })
    } else {
      router.push("/dashboard")
    }
    setIsPending(false)
  }

  useEffect(() => {
    if (searchParams.get("redirected") === "true") {
      setTimeout(() => {
        toast({
          title: "Unauthorized access",
          description: "You need to sign in to access the dashboard.",
          duration: 30000,
        })
      })
    }
  }, [toast, searchParams])

  return (
    <div className="grid gap-6 w-full">
      <Button
        className="w-full"
        disabled={isPending}
        onClick={() => signIn("anonymous")}
      >
        Sign in Anonymously
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        className="flex gap-2 font-semibold w-full"
        disabled={isPending}
        onClick={() => signIn("github")}
      >
        <Icons.gitHub className="w-6 h-6" /> GitHub
      </Button>
      <Button
        variant="outline"
        className="flex gap-2 font-semibold w-full"
        disabled={isPending}
        onClick={() => signIn("google")}
      >
        <Icons.google className="w-6 h-6" /> Google
      </Button>
    </div>
  )
}
