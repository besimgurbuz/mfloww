import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const { FB_PROJECT_ID, FB_CLIENT_EMAIL, FB_PRIVATE_KEY } = process.env

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FB_PROJECT_ID,
      clientEmail: FB_CLIENT_EMAIL,
      privateKey: FB_PRIVATE_KEY,
    }),
  })
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase Admin Error: ", error.stack)
  }
}

export const adminDB = getFirestore()
export const adminAuth = getAuth()
