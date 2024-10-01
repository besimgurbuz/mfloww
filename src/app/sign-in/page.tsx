import { Metadata } from "next"

import { SignInForm } from "@/components/sign-in/sign-in-form"

import { ClosedBeta } from "./closed-beta"

export const metadata: Metadata = {
  title: "Sign in | mfloww",
}

const closedBetaActive = process.env.CLOSED_BETA === "true"

export default function SignIn() {
  return (
    <div className="custom-container relative flex flex-col custom-min-h w-[350px] md:w-[500px]">
      <div className="flex flex-col flex-grow justify-center gap-4 md:gap-8">
        <div className="mx-auto flex flex-col justify-center space-y-6">
          {closedBetaActive ? (
            <ClosedBeta />
          ) : (
            <>
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sign in
                </h1>
                <p className="text-sm text-muted-foreground">
                  You can sign in with a provider you choose.
                </p>
              </div>
              <SignInForm />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
