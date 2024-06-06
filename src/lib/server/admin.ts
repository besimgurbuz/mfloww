import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

try {
  console.log("Firebase Admin Initializing...")
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY,
    }),
  })
  console.log("Firebase Admin Initialized")
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase Admin Error: ", error.stack)
  }
}

export const adminDB = getFirestore()
export const adminAuth = getAuth()
