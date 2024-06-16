"use client"

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react"

import { ExchangeRate, SupportedCurrencyCode } from "@/lib/definitions"
import { useStorage } from "@/lib/hooks"
import { useTransactions } from "@/lib/local-db/hooks"
import { fetchExchangeRates } from "@/lib/rates"
import { Transaction } from "@/lib/transaction"

type RatesStore = Record<SupportedCurrencyCode, ExchangeRate["rates"]>

export const DashboardStateContext = createContext<{
  baseCurrency: SupportedCurrencyCode
  selectedDate: string
  entryTransactions: Transaction[]
  entryIncomes: Transaction[]
  entryExpenses: Transaction[]
  ratesStore: RatesStore
  setSelectedDate: (newEntry: string) => void
}>({
  baseCurrency: "USD",
  selectedDate: "",
  entryTransactions: [],
  entryIncomes: [],
  entryExpenses: [],
  ratesStore: {} as RatesStore,
  setSelectedDate: () => {},
})
const EXCHANGE_RATE_INTERVAL = 1000 * 60 * 5

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
  const [ratesStore, setRatesStore] = useState<RatesStore>({} as RatesStore)

  const fillExchangeRates = useCallback(async () => {
    const exchangeRates = await fetchExchangeRates(baseCurrency)
    setRatesStore((prev) => ({
      ...prev,
      [baseCurrency]: exchangeRates,
    }))
  }, [baseCurrency])

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

  useEffect(() => {
    fillExchangeRates()
    const interval = setInterval(() => {
      fillExchangeRates()
    }, EXCHANGE_RATE_INTERVAL)

    return () => clearInterval(interval)
  }, [fillExchangeRates])

  return (
    <DashboardStateContext.Provider
      value={{
        baseCurrency,
        selectedDate,
        entryTransactions,
        entryIncomes,
        entryExpenses,
        ratesStore: ratesStore,
        setSelectedDate,
      }}
    >
      {children}
    </DashboardStateContext.Provider>
  )
}
