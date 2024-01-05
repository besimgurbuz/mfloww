"use server"

import { signIn, signOut as signOutFn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(provider: string | undefined) {
  try {
    await signIn(provider)
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: `Something went wrong while trying to sign in ${
          provider === "credentials" ? "as anonymously" : `with ${provider}`
        }`,
      }
    }
    throw error
  }
}

export async function signOut() {
  try {
    await signOutFn()
  } catch (error) {
    throw error
  }
}
