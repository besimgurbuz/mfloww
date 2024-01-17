import { createContext } from "react"

import { DBConnection, DBTransaction } from "@/lib/db"

export const DBContext = createContext<{
  connection?: DBConnection | null
  transaction?: DBTransaction | null
}>({
  connection: null,
  transaction: null,
})
