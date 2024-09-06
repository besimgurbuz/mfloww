import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { Timestamp } from "firebase-admin/firestore"

import { adminAuth, adminDB } from "@/lib/server/admin"

export const GET = async (req: NextRequest) => {
  const sessionCookie = cookies().get("__session")

  if (!sessionCookie) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }

  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie.value)

  if (!decodedToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }

  const userId = decodedToken.uid

  const latestSync = await adminDB.collection("sync").doc(userId).get()

  return NextResponse.json({
    hasSync: latestSync.exists,
    createdAt: (latestSync.data()?.createdAt as Timestamp)?.toDate(),
    expiresAt: (latestSync.data()?.expiresAt as Timestamp)?.toDate(),
  })
}
