import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { adminAuth } from "@/lib/server/admin"

type ResponseData = {
  status: "signed-in" | "error"
  error?: string
}

export const POST = async (
  req: NextRequest,
  res: NextResponse<ResponseData>
) => {
  const body = await req.json()
  const { idToken } = body
  console.log(body)
  const expiresIn = 60 * 60 * 24 * 8 * 1000 // 8 days
  const decodedToken = await adminAuth.verifyIdToken(idToken)

  if (new Date().getTime() / 1000 - decodedToken.auth_time < 5 * 60) {
    const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: "/",
    }

    const cookieStore = cookies()

    cookieStore.set("__session", cookie, options)

    return NextResponse.json({ status: "signed-in" }, { status: 200 })
  } else {
    return NextResponse.json(
      { status: "error", error: "Recent sign-in required" },
      { status: 401 }
    )
  }
}
