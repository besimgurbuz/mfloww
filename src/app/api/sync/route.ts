import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { Timestamp } from "firebase-admin/firestore"

import { adminAuth, adminDB } from "@/lib/server/admin"
import { encrypt } from "@/lib/server/crypto"

// Use the environment variable or default to 24 hours if not set
const SYNC_EXPIRATION_TIME = process.env.SYNC_DATA_EXPIRATION_TIME
  ? parseInt(process.env.SYNC_DATA_EXPIRATION_TIME, 10)
  : 1000 * 60 * 60 * 24

export const POST = async (req: NextRequest) => {
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
  const { data } = await req.json()

  const remainingUpload = await adminDB
    .collection("sync-remain")
    .doc(userId)
    .get()

  if (remainingUpload.exists && remainingUpload.data()?.remain < 1) {
    return NextResponse.json(
      {
        message: "No remaining upload",
      },
      {
        status: 400,
      }
    )
  }

  if (!validateData(data)) {
    return NextResponse.json(
      {
        message: "Uploaded data is corrupted",
      },
      {
        status: 400,
      }
    )
  }

  const encryptedData = encrypt(data)
  await adminDB
    .collection("sync-remain")
    .doc(userId)
    .set({
      remain: (remainingUpload.data()?.remain || 3) - 1,
    })
  await adminDB
    .collection("sync")
    .doc(userId)
    .set({
      data: encryptedData,
      expiresAt: Timestamp.fromMillis(Date.now() + SYNC_EXPIRATION_TIME),
    })

  return NextResponse.json({
    message: `Data uploaded successfully, ${
      remainingUpload.data()?.remain - 1
    } uploads remaining. Your data will be available for download for the next 24 hours.`,
  })
}

function validateData(data: unknown): boolean {
  if (!Array.isArray(data)) {
    return false
  }

  for (const item of data) {
    if (typeof item !== "object" || item === null) {
      return false
    }

    if (!item["data"] || !item["id"] || !item["userId"]) {
      return false
    }
  }

  return true
}
