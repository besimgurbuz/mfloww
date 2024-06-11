import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBOx7gibolphnmDHonB5GbVac-6p9VM0e8",
  authDomain: "mfloww.firebaseapp.com",
  projectId: "mfloww",
  storageBucket: "mfloww.appspot.com",
  messagingSenderId: "60004601009",
  appId: "1:60004601009:web:452e193c80a398de74a690",
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore()
export const auth = getAuth()
