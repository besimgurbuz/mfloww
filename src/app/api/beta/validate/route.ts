import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { adminDB } from "@/lib/server/admin"
import { decrypt } from "@/lib/server/crypto"

export const POST = async (req: NextRequest) => {
  const betaAccessKey = cookies().get("__beta_access")

  if (!betaAccessKey?.value) {
    return NextResponse.json(
      {
        error: "Beta access invalid",
      },
      {
        status: 403,
      }
    )
  }

  const accessInfoDoc = await adminDB
    .collection("beta")
    .doc(decrypt(betaAccessKey.value))
    .get()

  if (!accessInfoDoc.exists || accessInfoDoc.data()?.used) {
    return NextResponse.json(
      {
        error: "Beta access invalid",
      },
      {
        status: 403,
      }
    )
  }

  return NextResponse.json(
    {
      message: "Beta access validated",
    },
    {
      status: 200,
    }
  )
}
