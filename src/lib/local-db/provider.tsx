"use client"

import { ReactNode, useState } from "react"

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
  const [tickCount, setTickCount] = useState(0)

  function tick() {
    setTickCount((tick) => tick + 1)
  }

  return (
    <>
      <DBContext.Provider value={{ connection, tickCount: tickCount, tick }}>
        {children}
      </DBContext.Provider>
    </>
  )
}
