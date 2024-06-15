import { ExchangeRate, SupportedCurrencyCode } from "./definitions"

export async function fetchExchangeRates(baseCurrency: SupportedCurrencyCode) {
  const response = await fetch(`/api/rates?base=${baseCurrency}`)
  const data = await response.json()
  return data.rates as ExchangeRate["rates"]
}
