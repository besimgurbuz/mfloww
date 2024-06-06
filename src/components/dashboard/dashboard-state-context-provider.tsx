"use client"

import { ReactNode, useEffect, useState } from "react"

import { Entry } from "@/lib/definitions"
import { useStorage } from "@/lib/hooks"
import { useEntries, useTransactions } from "@/lib/local-db/hooks"
import { Transaction } from "@/lib/transaction"

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
    if (entries.length === 0) {
      return
    }
    const newSelectedEntry =
      entries.find((entry) => entry.name === selectedEntryName) || entries[0]
    setSelectedEntry(newSelectedEntry)

    const entryTransactions = transactions.filter(
      (transaction) => transaction.date === newSelectedEntry.date
    )
    entryTransactions.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))

    const entryIncomes = entryTransactions.filter((el) => el.type === "income")
    const entryExpenses = entryTransactions.filter(
      (transaction) => transaction.type === "expense"
    )
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
