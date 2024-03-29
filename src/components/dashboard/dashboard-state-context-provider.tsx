"use client"

import { ReactNode, useEffect, useState } from "react"

import { Transaction } from "@/lib/transaction"

import { useEntries, useTransactions } from "../../lib/db/hooks"
import { Entry } from "../../lib/definitions"
import { useStorage } from "../../lib/hooks"
import { DashboardStateContext } from "./dashboard-state-context"

export function DashboardStateContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [selectedEntryName, setSelectedEntryName] = useStorage<string>(
    "SELECTED_ENTRY",
    "sessionStorage"
  )
  const entries = useEntries()
  const { transactions } = useTransactions()
  const [selectedEntry, setSelectedEntry] = useState<Entry>()
  const [entryTransactions, setEntryTransactions] = useState<Transaction[]>([])
  const [entryIncomes, setEntryIncomes] = useState<Transaction[]>([])
  const [entryExpenses, setEntryExpenses] = useState<Transaction[]>([])

  useEffect(() => {
    const newSelectedEntry =
      entries.find((entry) => entry.name === selectedEntryName) || entries[0]
    setSelectedEntry(newSelectedEntry)

    const entryTransactions = []
    const entryIncomes = []
    const entryExpenses = []
    for (const transaction of transactions) {
      if (transaction.date === newSelectedEntry.date || transaction.isRegular) {
        if (transaction.type === "income") {
          entryIncomes.push(transaction)
        } else {
          entryExpenses.push(transaction)
        }
        entryTransactions.push(transaction)
      }
    }
    setEntryTransactions(entryTransactions)
    setEntryIncomes(entryIncomes)
    setEntryExpenses(entryExpenses)
  }, [selectedEntryName, entries, transactions])

  return (
    <DashboardStateContext.Provider
      value={{
        entries,
        selectedEntry: selectedEntry,
        entryTransactions: entryTransactions,
        entryIncomes: entryIncomes,
        entryExpenses: entryExpenses,
        setSelectedEntry: setSelectedEntryName,
      }}
    >
      {children}
    </DashboardStateContext.Provider>
  )
}
