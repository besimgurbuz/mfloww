import { SupportedCurrencyCode } from "../definitions"

export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  name: string
  type: TransactionType
  amount: number
  isRegular: boolean
  category?: string
  currency: SupportedCurrencyCode
  date: string
  exchangeRate: Record<SupportedCurrencyCode, number>
}

export interface EncryptedTransaction {
  id: string
  userId: string
  data: string
}
