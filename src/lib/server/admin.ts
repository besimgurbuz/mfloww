import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const { FB_PROJECT_ID, FB_PRIVATE_KEY, FB_CLIENT_EMAIL } = process.env

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FB_PROJECT_ID,
      privateKey: (FB_PRIVATE_KEY as string).replace(/\\n/g, "\n"),
      clientEmail: FB_CLIENT_EMAIL,
    }),
  })
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase Admin Error: ", error.stack)
  }
}

export const adminDB = getFirestore()
export const adminAuth = getAuth()
