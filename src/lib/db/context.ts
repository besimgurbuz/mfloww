import { createContext } from "react"

import { DBConnection } from "@/lib/db"

export const DBContext = createContext<{
  connection?: DBConnection | null
  tickCount: number
  tick: () => void
}>({
  connection: null,
  tickCount: 0,
  tick: () => {},
})
