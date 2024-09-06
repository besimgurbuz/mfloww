import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { Timestamp } from "firebase-admin/firestore"

import { adminAuth, adminDB } from "@/lib/server/admin"
import { decrypt, encrypt } from "@/lib/server/crypto"

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
  const data = await req.json()

  if (!validateData(data)) {
    return NextResponse.json(
      {
        message: "Uploaded data is invalid",
      },
      {
        status: 400,
      }
    )
  }

  const encryptedData = encrypt(JSON.stringify(data))
  await adminDB
    .collection("sync")
    .doc(userId)
    .set({
      data: encryptedData,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromMillis(Date.now() + SYNC_EXPIRATION_TIME),
    })

  return NextResponse.json({
    message: "Data uploaded successfully",
  })
}

export const GET = async () => {
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
  const syncDataDoc = await adminDB.collection("sync").doc(userId).get()
  const syncData = syncDataDoc.data()

  if (!syncDataDoc.exists || !syncData) {
    return NextResponse.json(
      {
        message: "No data to download",
      },
      {
        status: 404,
      }
    )
  }

  try {
    const decryptedData = decrypt(syncData.data)

    return NextResponse.json(JSON.parse(decryptedData))
  } catch (error) {
    return NextResponse.json(
      {
        message: "No available data to download",
      },
      {
        status: 404,
      }
    )
  }
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
