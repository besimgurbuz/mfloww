"use client"

import { useEffect, useState } from "react"

import { SignInForm } from "@/components/sign-in/sign-in-form"

export function ClosedBeta() {
  const betaActivated = useBetaActivated()

  if (betaActivated) {
    return (
      <div className="flex flex-col gap-4 space-y-2 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Welcome to closed beta!</h1>
          <p className="text-muted-foreground text-sm">
            You can now sign in as closed beta user
          </p>
        </div>
        <SignInForm />
      </div>
    )
  }

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

function useBetaActivated() {
  const [betaActivated, setBetaActivated] = useState(false)

  const fetchBetaValidated = async () => {
    const res = await fetch("/api/beta/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (res.ok) {
      setBetaActivated(true)
    }
  }

  useEffect(() => {
    fetchBetaValidated()
  }, [])

  return betaActivated
}
