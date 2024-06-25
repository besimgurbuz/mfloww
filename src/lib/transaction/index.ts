import { SupportedCurrencyCode } from "../definitions"

export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  name: string
  type: TransactionType
  amount: number
  category?: string
  currency: SupportedCurrencyCode
  date: {
    start: number
    end: number
  }
  exchangeRate: Record<SupportedCurrencyCode, number>
}
