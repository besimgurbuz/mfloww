"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

export function BetaAcessForm() {
  const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$"
  const router = useRouter()
  const { toast } = useToast()
  const [accessCode, setAccessCode] = useState("")
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const submitActivate = async () => {
    setSubmitInProgress(true)
    const res = await fetch("/api/beta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessCode }),
    })

    if (res.ok) {
      router.push("/sign-in")
      toast({
        title: "Beta Access activated",
        description: "You can now sign in with your account.",
        duration: 10000,
      })
    } else {
      const { error } = await res.json()
      toast({
        title: "Beta Access Failed",
        description: error,
        variant: "destructive",
        duration: 30000,
      })
    }
    setSubmitInProgress(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <InputOTP
        maxLength={12}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        value={accessCode}
        type="text"
        onChange={(value) => setAccessCode(value.toUpperCase())}
      >
        <InputOTPGroup className="w-fit">
          {Array.from({ length: 12 }).map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Button
        disabled={accessCode.length < 12 || submitInProgress}
        onClick={submitActivate}
        className="flex gap-2"
      >
        {submitInProgress && <Icons.spinner className="w-4 h-4 animate-spin" />}
        Activate access
      </Button>
    </div>
  )
}
