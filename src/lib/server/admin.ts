import admin, { ServiceAccount } from "firebase-admin"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

import serviceAccount from "../../../service-key.json"

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  })
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase Admin Error: ", error.stack)
  }
}

export const adminDB = getFirestore()
export const adminAuth = getAuth()
