import admin from "firebase-admin"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const { FB_ACCOUNT } = process.env

const serviceCredentials = JSON.parse(FB_ACCOUNT!)
serviceCredentials.private_key = serviceCredentials.private_key.replace(
  /\\n/g,
  "\n"
)

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceCredentials),
  })
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase Admin Error: ", error.stack)
  }
}

export const adminDB = getFirestore()
export const adminAuth = getAuth()
