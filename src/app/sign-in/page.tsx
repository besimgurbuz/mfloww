import { Metadata } from "next"

import { SignInForm } from "@/components/sign-in/sign-in-form"

export const metadata: Metadata = {
  title: "Sign in | mfloww",
}

const closedBetaActive = process.env.CLOSED_BETA

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
                  You can either continue as anonymous or sign in with a
                  provider you choose.
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

function ClosedBeta() {
  return (
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold text-center">Closed beta</h1>
      <p className="text-sm text-muted-foreground">
        We are currently in a closed beta phase.
      </p>
      <p className="text-sm text-muted-foreground">
        We would like you to join our exclusive group of testers. By
        participating, you’ll gain exclusive access to new enhancements, provide
        valuable feedback, and gain discounts on future subscriptions.
      </p>
      <p className="text-sm text-muted-foreground">
        If you are interested in joining our closed beta, reach out to us at{" "}
        <a
          href="mailto:contact@mfloww.com?subject=Closed Beta Interest"
          className="font-medium underline underline-offset-4"
        >
          contact@mfloww.com
        </a>{" "}
        to express your interest and get started .
      </p>
      <p className="text-sm font-medium text-muted-foreground">
        Together, we&apos;ll create something amazing!
      </p>
    </div>
  )
}
