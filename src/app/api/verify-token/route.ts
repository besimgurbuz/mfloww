import { NextRequest, NextResponse } from "next/server"

import { adminAuth } from "@/lib/server/admin"

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

  return new NextResponse(
    JSON.stringify({
      message: "Authorized",
    }),
    {
      status: 200,
    }
  )
}
