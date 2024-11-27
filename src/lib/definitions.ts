import { typedObjectKeys } from "./utils"

export const MONTH_NAMES: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const MONTH_ABREVVESIONS: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const SUPPORTED_CURRENCIES = {
  AUD: "🇦🇺",
  BND: "🇧🇳",
  BRL: "🇧🇷",
  CAD: "🇨🇦",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  CZK: "🇨🇿",
  EGP: "🇪🇬",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  INR: "🇮🇳",
  IRR: "🇮🇷",
  JOD: "🇯🇴",
  JPY: "🇯🇵",
  KRW: "🇰🇷",
  KWD: "🇰🇼",
  LYD: "🇱🇾",
  MXN: "🇲🇽",
  NZD: "🇳🇿",
  OMR: "🇴🇲",
  PHP: "🇵🇭",
  RUB: "🇷🇺",
  SGD: "🇸🇬",
  THB: "🇹🇭",
  TRY: "🇹🇷",
  USD: "🇺🇸",
  UAH: "🇺🇦",
  VND: "🇻🇳",
} as const

export type SupportedCurrencyCode = keyof typeof SUPPORTED_CURRENCIES

export const SUPPORTED_CURRENCY_CODES = typedObjectKeys(SUPPORTED_CURRENCIES)
export const SUPPORTED_CURRENCY_FLAGS = Object.values(SUPPORTED_CURRENCIES)

export type StorageType = "localStorage" | "sessionStorage"
export type StorageKey = string

export type SetValueToStorage = <T>(
  key: StorageKey,
  value: T,
  storageType: StorageType
) => void

export type GetValueFromStorage = <T>(
  key: StorageKey,
  storageType: StorageType
) => T | null

export interface ExchangeRate {
  base: SupportedCurrencyCode
  rates: Record<SupportedCurrencyCode, number>
  remaining?: number
}

export type RatesStore = Record<SupportedCurrencyCode, ExchangeRate["rates"]>

export type MontlyDifference = {
  percentage: number
  isIncreased: boolean
  type: "income" | "expense"
}
