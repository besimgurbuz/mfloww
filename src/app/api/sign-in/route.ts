import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { adminAuth, adminDB } from "@/lib/server/admin"

export const POST = async (req: NextRequest) => {
  const { idToken } = await req.json()

  if (process.env.ALLOW_SIGN_IN !== "true") {
    return NextResponse.json(
      {
        status: "error",
        error: "Sign in is disabled at the moment. Please try again later.",
      },
      { status: 403 }
    )
  }

  const expiresIn = 60 * 60 * 24 * 12 * 1000 // 12 days
  const decodedToken = await adminAuth.verifyIdToken(idToken)
  const usersCollection = adminDB.collection("users")
  const user = await usersCollection.doc(decodedToken.uid).get()

  if (!user.exists) {
    await usersCollection.doc(decodedToken.uid).set({
      key: crypto.randomUUID(),
    })
  }

  if (new Date().getTime() / 1000 - decodedToken.auth_time < 5 * 60) {
    const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: "/",
    }
    cookies().set("__session", cookie, options)

    return NextResponse.json({ status: "signed-in" }, { status: 200 })
  } else {
    return NextResponse.json(
      { status: "error", error: "Recent sign-in required" },
      { status: 401 }
    )
  }
}

export const DELETE = async (req: NextRequest) => {
  cookies().delete("__session")
  return NextResponse.json({ status: "signed-out" }, { status: 200 })
}
