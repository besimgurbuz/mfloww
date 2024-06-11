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
  } | null
  loading: boolean
}
const UserContext = createContext<UserState>({ user: null, loading: true })

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserState["user"]>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null)
        setLoading(false)
        return
      }
      setLoading(true)
      const usersCollection = collection(db, "users")
      const userDoc = await getDoc(doc(usersCollection, user?.uid))

      if (userDoc.exists()) {
        setUser({
          id: user.uid,
          key: userDoc.data()!.key,
          name: user.displayName || user.email || "Anonymous",
          email: user.email || "",
          image: user.photoURL || "",
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext<UserState>(UserContext)
