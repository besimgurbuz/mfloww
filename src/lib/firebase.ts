import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBOx7gibolphnmDHonB5GbVac-6p9VM0e8",
  authDomain: "mfloww.firebaseapp.com",
  projectId: "mfloww",
  storageBucket: "mfloww.appspot.com",
  messagingSenderId: "60004601009",
  appId: "1:60004601009:web:264cff16bf6022d374a690",
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore()
export const auth = getAuth()
