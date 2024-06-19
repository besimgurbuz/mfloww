"use client"

import { createContext, ReactNode, useEffect, useState } from "react"

import {
  MontlyDifference,
  RatesStore,
  SupportedCurrencyCode,
} from "@/lib/definitions"
import {
  useExchangeRatesStore,
  useMontlyDiffPercentage,
  useStorage,
} from "@/lib/hooks"
import { useTransactions } from "@/lib/local-db/hooks"
import { Transaction } from "@/lib/transaction"

export type DashboardContext = {
  baseCurrency: SupportedCurrencyCode
  selectedDate: string
  entryTransactions: Transaction[]
  entryIncomes: Transaction[]
  entryExpenses: Transaction[]
  ratesStore: RatesStore
  montlyDifference: {
    incomeDiff: MontlyDifference | null
    expenseDiff: MontlyDifference | null
  }
  setSelectedDate: (newEntry: string) => void
}

export const DashboardStateContext = createContext<DashboardContext>({
  baseCurrency: "USD",
  selectedDate: "",
  entryTransactions: [],
  entryIncomes: [],
  entryExpenses: [],
  ratesStore: {} as RatesStore,
  montlyDifference: {
    incomeDiff: null,
    expenseDiff: null,
  },
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
  const [baseCurrency] = useStorage<SupportedCurrencyCode>(
    "SELECTED_BASE_CURRENCY",
    "localStorage",
    "USD"
  )
  const { transactions } = useTransactions()
  const [entryTransactions, setEntryTransactions] = useState<Transaction[]>([])
  const [entryIncomes, setEntryIncomes] = useState<Transaction[]>([])
  const [entryExpenses, setEntryExpenses] = useState<Transaction[]>([])
  const ratesStore = useExchangeRatesStore(baseCurrency)
  const { incomeDiff, expenseDiff } = useMontlyDiffPercentage(
    transactions,
    baseCurrency,
    selectedDate
  )

  useEffect(() => {
    const entryTransactions = transactions
      .filter(
        (transaction) =>
          transaction.date === selectedDate || transaction.isRegular
      )
      .sort(
        (a, b) =>
          Math.abs(b.amount * (b.exchangeRate[baseCurrency] || 1)) -
          Math.abs(a.amount * (a.exchangeRate[baseCurrency] || 1))
      )

    const entryIncomes = entryTransactions.filter((el) => el.type === "income")
    const entryExpenses = entryTransactions.filter(
      (transaction) => transaction.type === "expense"
    )
    setEntryTransactions(entryTransactions)
    setEntryIncomes(entryIncomes)
    setEntryExpenses(entryExpenses)
  }, [selectedDate, transactions, baseCurrency])

  return (
    <DashboardStateContext.Provider
      value={{
        baseCurrency,
        selectedDate,
        entryTransactions,
        entryIncomes,
        entryExpenses,
        ratesStore: ratesStore,
        montlyDifference: {
          incomeDiff,
          expenseDiff,
        },
        setSelectedDate,
      }}
    >
      {children}
    </DashboardStateContext.Provider>
  )
}
