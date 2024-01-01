"use client"

import { useContext } from "react"

import { InfiniteProgress } from "@/components/ui/progress"
import { BaseContext } from "@/components/loading-progress-provider"

export function LoadıngProgress() {
  const context = useContext(BaseContext)

  if (context.loading) {
    return <InfiniteProgress className="absolute top-0" />
  }

  return null
}
