"use client"

import { createContext, ReactNode, useEffect, useState } from "react"

import { useStorage } from "@/lib/hooks"
import { useTransactions } from "@/lib/local-db/hooks"
import { Transaction } from "@/lib/transaction"

export const DashboardStateContext = createContext<{
  selectedDate: string
  entryTransactions: Transaction[]
  entryIncomes: Transaction[]
  entryExpenses: Transaction[]
  setSelectedDate: (newEntry: string) => void
}>({
  selectedDate: "",
  entryTransactions: [],
  entryIncomes: [],
  entryExpenses: [],
  setSelectedDate: () => {},
})

export function DashboardStateContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const today = new Date()
  const defaultDate = `${today.getMonth()}_${today.getFullYear()}`
  const [selectedDate, setSelectedDate] = useStorage<string>(
    "SELECTED_DATE",
    "sessionStorage",
    defaultDate
  )
  const { transactions } = useTransactions()
  const [entryTransactions, setEntryTransactions] = useState<Transaction[]>([])
  const [entryIncomes, setEntryIncomes] = useState<Transaction[]>([])
  const [entryExpenses, setEntryExpenses] = useState<Transaction[]>([])

  useEffect(() => {
    const entryTransactions = transactions.filter(
      (transaction) => transaction.date === selectedDate
    )
    entryTransactions.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))

    const entryIncomes = entryTransactions.filter((el) => el.type === "income")
    const entryExpenses = entryTransactions.filter(
      (transaction) => transaction.type === "expense"
    )
    setEntryTransactions(entryTransactions)
    setEntryIncomes(entryIncomes)
    setEntryExpenses(entryExpenses)
  }, [selectedDate, transactions])

  return (
    <DashboardStateContext.Provider
      value={{
        selectedDate,
        entryTransactions: entryTransactions,
        entryIncomes: entryIncomes,
        entryExpenses: entryExpenses,
        setSelectedDate,
      }}
    >
      {children}
    </DashboardStateContext.Provider>
  )
}
