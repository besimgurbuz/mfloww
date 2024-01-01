"use client"

import React, { createContext, useState } from "react"

export type BaseState = {
  loading: boolean
  setLoading: (state: boolean) => void
}

export const BaseContext = createContext<BaseState>({
  loading: false,
  setLoading: () => {},
})

export function LoadingProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const baseState = {
    loading,
    setLoading,
  }

  return (
    <BaseContext.Provider value={baseState}>{children}</BaseContext.Provider>
  )
}
