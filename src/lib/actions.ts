"use server"

import { signIn, signOut as signOutFn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticateAnonymously() {
  try {
    await signIn("credentials")
  } catch (error) {
    if (error instanceof AuthError) {
      return "Something went wrong while trying to sign in as anonymous"
    }
    throw error
  }
}

export async function authenticateWithGitHub() {
  try {
    await signIn("github")
  } catch (error) {
    if (error instanceof AuthError) {
      return "Something went wrong while trying to sign in with github"
    }
    throw error
  }
}

export async function authenticateWithGoogle() {
  try {
    await signIn("google")
  } catch (error) {
    if (error instanceof AuthError) {
      return "Something went wrong while trying to sign in with github"
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
