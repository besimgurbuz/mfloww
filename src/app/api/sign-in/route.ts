import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { adminAuth, adminDB } from "@/lib/server/admin"
import { decrypt } from "@/lib/server/crypto"

export const POST = async (req: NextRequest) => {
  const { idToken, name, provider, picture } = await req.json()

  if (!idToken || !name || !provider || !picture) {
    return NextResponse.json(
      { status: "error", error: "Required fields are missing" },
      { status: 400 }
    )
  }

  const expiresIn = 60 * 60 * 24 * 12 * 1000 // 12 days
  const decodedToken = await adminAuth.verifyIdToken(idToken)
  const usersCollection = adminDB.collection("users")

  if (process.env.CLOSED_BETA === "true") {
    const betaAccess = cookies().get("__beta_access")

    if (!betaAccess?.value) {
      return NextResponse.json(
        {
          status: "error",
          error: "We're in closed beta test. Please try again later.",
        },
        { status: 403 }
      )
    }

    const accessInfoDoc = await adminDB
      .collection("beta")
      .doc(decrypt(betaAccess.value))
      .get()

    if (!accessInfoDoc.exists || accessInfoDoc.data()?.used) {
      cookies().delete("__beta_access")
      return NextResponse.json(
        {
          status: "error",
          error: "The access code is invalid or already used.",
        },
        { status: 403 }
      )
    }

    await accessInfoDoc.ref.update({
      used: true,
      usedAt: new Date(),
      usedBy: decodedToken.email,
    })
    cookies().delete("__beta_access")
  }

  const user = await usersCollection.doc(decodedToken.uid).get()
  if (!user.exists) {
    await usersCollection.doc(decodedToken.uid).set({
      key: crypto.randomUUID(),
      name,
      provider,
      picture,
    })
  }

  if (new Date().getTime() / 1000 - decodedToken.auth_time < 5 * 60) {
    const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: "/",
    }
    cookies().set("__session", cookie, options)

    return NextResponse.json({ status: "signed-in" }, { status: 200 })
  } else {
    return NextResponse.json(
      { status: "error", error: "Recent sign-in required" },
      { status: 401 }
    )
  }
}

export const DELETE = async () => {
  cookies().delete("__session")
  return NextResponse.json({ status: "signed-out" }, { status: 200 })
}
