import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { adminAuth, adminDB } from "@/lib/server/admin"

type ResponseData = {
  status: "signed-in" | "error"
  error?: string
}

export const POST = async (req: NextRequest) => {
  const { idToken } = await req.json()
  const expiresIn = 60 * 60 * 24 * 8 * 1000 // 8 days
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
  req.cookies.delete("__session")
  return NextResponse.json({ status: "signed-out" }, { status: 200 })
}
