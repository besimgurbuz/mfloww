import React from "react"

import { DBContextProvider } from "@/lib/local-db/provider"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DBContextProvider>
        <main>{children}</main>
      </DBContextProvider>
    </>
  )
}
