import { createContext } from "react"

import { DBConnection } from "@/lib/db"

export const DBContext = createContext<{
  connection?: DBConnection | null
}>({
  connection: null,
})
