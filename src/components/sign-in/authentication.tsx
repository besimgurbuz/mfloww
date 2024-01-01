"use client"

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useFormState } from "react-dom"

import {
  authenticateAnonymously,
  authenticateWithGitHub,
  authenticateWithGoogle,
} from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import { Icons } from "../icons"

export function Authentication() {
  const [anonymousSignInError, dispatchAnonymousSignIn] = useFormState(
    authenticateAnonymously,
    undefined
  )
  const [gitHubSignInError, dispatchGitHubSignIn] = useFormState(
    authenticateWithGitHub,
    undefined
  )
  const [googleSignInError, dispatchGoogleSignIn] = useFormState(
    authenticateWithGoogle,
    undefined
  )

  return (
    <div className="flex flex-col flex-grow justify-center gap-4 md:gap-8">
      <div className="mx-auto flex flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            You can either continue as anonymous or sign in with a provider you
            choose.
          </p>
        </div>
        <div className="grid gap-6">
          <form action={dispatchAnonymousSignIn} className="w-full">
            <Button className="w-full">Sign in Anonymously</Button>
          </form>
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
          <form action={dispatchGitHubSignIn} className="w-full">
            <Button
              variant="outline"
              className="flex gap-2 font-semibold w-full"
            >
              <Icons.gitHub className="w-6 h-6" /> GitHub
            </Button>
          </form>
          <form action={dispatchGoogleSignIn} className="w-full">
            <Button
              variant="outline"
              className="flex gap-2 font-semibold w-full"
            >
              <Icons.google className="w-6 h-6" /> Google
            </Button>
          </form>
        </div>
      </div>
      {(anonymousSignInError || gitHubSignInError || googleSignInError) && (
        <Alert variant="destructive" className="overflow-hidden">
          <ExclamationTriangleIcon className="h-4 w-w" />
          <AlertTitle>Sign in error</AlertTitle>
          <AlertDescription>{anonymousSignInError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
