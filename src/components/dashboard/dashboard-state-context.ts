import { createContext } from "react"

import { Transaction } from "@/lib/transaction"

import { Entry } from "../../lib/definitions"

export const DashboardStateContext = createContext<{
  entries: Entry[]
  selectedEntry?: Entry
  entryTransactions: Transaction[]
  entryIncomes: Transaction[]
  entryExpenses: Transaction[]
  setSelectedEntry: (newEntry: string) => void
}>({
  entries: [],
  selectedEntry: undefined,
  entryTransactions: [],
  entryIncomes: [],
  entryExpenses: [],
  setSelectedEntry: () => {},
})
