import { NextRequest, NextResponse } from "next/server"

import { adminAuth, adminDB } from "@/lib/server/admin"

export const POST = async (req: NextRequest, res: NextResponse) => {
  const sessionCookie = req.cookies.get("__session")

  if (!sessionCookie) {
    return new NextResponse(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 401,
      }
    )
  }

  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie.value)

  if (!decodedToken) {
    return new NextResponse(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 401,
      }
    )
  }

  const userData = (
    await adminDB.collection("users").doc(decodedToken.uid).get()
  ).data()

  if (!userData) {
    return new NextResponse(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 401,
      }
    )
  }

  return new NextResponse(
    JSON.stringify({
      id: decodedToken.uid,
      key: userData!.key,
      name: userData!.name,
      email: decodedToken.email,
      image: decodedToken.picture,
    }),
    {
      status: 200,
    }
  )
}
