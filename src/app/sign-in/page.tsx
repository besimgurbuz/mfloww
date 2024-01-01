import { Metadata } from "next"

import { Authentication } from "@/components/sign-in/authentication"

export const metadata: Metadata = {
  title: "Sign in | mfloww",
}

export default function SignIn() {
  return (
    <div className="container relative flex flex-col min-h-[calc(100vh-192px)] w-[350px] md:w-[500px]">
      <Authentication />
    </div>
  )
}
