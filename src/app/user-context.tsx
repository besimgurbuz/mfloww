"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc } from "firebase/firestore"

import { auth, db } from "@/lib/firebase"

export type UserState = {
  user: {
    id: string
    key: string
    name: string
    email: string
    image: string
    provider: "google" | "email" | "anonymous"
  } | null
  loading: boolean
  syncUser: () => void
}
const UserContext = createContext<UserState>({
  user: null,
  loading: true,
  syncUser: () => {},
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserState["user"]>(null)
  const [loading, setLoading] = useState(true)
  const syncUser = async () => {
    const user = auth.currentUser

    if (!user) {
      setUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const usersCollection = collection(db, "users")
    const userDoc = await getDoc(doc(usersCollection, user.uid))
    const userData = userDoc.data()

    if (userDoc.exists()) {
      setUser({
        id: user.uid,
        key: userData!.key,
        name: userData!.name,
        email: user.email || "",
        image: userData!.picture,
        provider: userData!.provider as "google" | "email" | "anonymous",
      })
    } else {
      setUser(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    const verify = async () => {
      const res = await fetch("/api/verify-token", { method: "POST" })

      if (res.ok) {
        const user = await res.json()
        setUser(user)
        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
      }
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await syncUser()
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    verify()

    return unsubscribe
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, syncUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext<UserState>(UserContext)
