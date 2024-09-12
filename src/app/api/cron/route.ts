import { NextRequest, NextResponse } from "next/server"
import { Timestamp } from "firebase-admin/firestore"

import { adminDB } from "@/lib/server/admin"

export const GET = async (req: NextRequest) => {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const syncs = await adminDB.collection("sync").get()

  for (const syncDoc of syncs.docs) {
    const syncData = syncDoc.data()
    const expiresAt = syncData.expiresAt as Timestamp

    if (expiresAt.toMillis() < Date.now()) {
      await adminDB.collection("sync").doc(syncDoc.id).delete()
    }
  }

  return NextResponse.json({ message: "Cron job executed" }, { status: 200 })
}
