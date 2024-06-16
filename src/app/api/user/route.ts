import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { adminAuth, adminDB } from "@/lib/server/admin"

export const PUT = async (req: NextRequest) => {
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

  const { name } = await req.json()

  if (!name) {
    return new NextResponse(
      JSON.stringify({
        message: "Invalid name",
      }),
      {
        status: 400,
      }
    )
  }

  await adminDB.collection("users").doc(decodedToken.uid).update({
    name,
  })

  return new NextResponse(
    JSON.stringify({
      message: "Name updated successfully",
    }),
    {
      status: 200,
    }
  )
}

export const DELETE = async (req: NextRequest) => {
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

  await adminDB.collection("users").doc(decodedToken.uid).delete()
  await adminAuth.deleteUser(decodedToken.uid)
  cookies().delete("__session")

  return new NextResponse(
    JSON.stringify({
      message: "User deleted successfully",
    }),
    {
      status: 200,
    }
  )
}
