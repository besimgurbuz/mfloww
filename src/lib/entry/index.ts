import { SupportedCurrencyCode } from "../definitions"

export type EntryType = "income" | "expense"

export interface Entry {
  id: string
  name: string
  type: EntryType
  amount: number
  isRegular: boolean
  category?: string
  currency: SupportedCurrencyCode
  date: string
  exchangeRate: Record<SupportedCurrencyCode, number>
}
