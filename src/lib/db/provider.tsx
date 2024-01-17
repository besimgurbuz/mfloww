"use client"

import { ReactNode } from "react"

import { DBContext } from "./context"
import { useCreateAndInitDB } from "./hooks"

export function DBContextProvider({
  version,
  children,
}: {
  version?: number
  children: ReactNode
}) {
  const { connection, transaction, inProgress } = useCreateAndInitDB(version)

  return (
    <>
      {inProgress && "DB creating"}
      <DBContext.Provider value={{ connection, transaction }}>
        {children}
      </DBContext.Provider>
    </>
  )
}
