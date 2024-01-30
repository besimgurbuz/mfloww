"use client"

import { ReactNode } from "react"

import { DBContext } from "./context"
import { useCreateAndInitLocalDB } from "./hooks"

export function DBContextProvider({
  version,
  children,
}: {
  version?: number
  children: ReactNode
}) {
  const { connection, inProgress } = useCreateAndInitLocalDB(version)

  return (
    <>
      <DBContext.Provider value={{ connection }}>{children}</DBContext.Provider>
    </>
  )
}
