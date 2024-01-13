export type EntryType = "income" | "expense"

export interface Entry {
  amount: number
  name: string
  type: EntryType
  isRegular: boolean
  category?: string
  currency: SupportedCurrencyCode
  createdAt: string
}

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

export const SUPPORTED_CURRENCY_CODES: SupportedCurrencyCode[] = Object.keys(
  SUPPORTED_CURRENCIES
) as SupportedCurrencyCode[]
export const SUPPORTED_CURRENCY_FLAGS = Object.values(SUPPORTED_CURRENCIES)

export function getTargetCurrenciesByBase(
  base: SupportedCurrencyCode
): SupportedCurrencyCode[] {
  const codes = Object.keys(SUPPORTED_CURRENCIES)
  return codes.filter((code) => code !== base) as SupportedCurrencyCode[]
}
