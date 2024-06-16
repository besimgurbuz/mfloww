import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { adminDB } from "@/lib/server/admin"
import { encrypt } from "@/lib/server/crypto"

export const POST = async (req: NextRequest) => {
  const { accessCode } = await req.json()

  if (!accessCode) {
    return NextResponse.json(
      {
        error: "Access code is required",
      },
      {
        status: 400,
      }
    )
  }

  const accessInfoDoc = await adminDB.collection("beta").doc(accessCode).get()

  if (!accessInfoDoc.exists || accessInfoDoc.data()?.used) {
    return NextResponse.json(
      {
        error: "The access code is invalid or already used.",
      },
      { status: 403 }
    )
  }

  cookies().set("__beta_access", encrypt(accessCode), {
    maxAge: 60 * 60 * 1, // 1 hour
    httpOnly: true,
    secure: true,
    path: "/",
  })
  return NextResponse.json(
    {
      message: "Access validated",
    },
    { status: 200 }
  )
}
