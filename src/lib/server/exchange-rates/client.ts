import {
  ExchangeRate,
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from "@/lib/definitions"

export abstract class ExchangeClient {
  abstract readonly name?: string
  abstract readonly apiUrl: string
  abstract readonly apiKey: string
  abstract readonly remainingQuotesKey?: string

  protected readonly supportedCurrencyKeys = SUPPORTED_CURRENCY_CODES

  abstract getExchangeRates(
    baseCurrency: SupportedCurrencyCode
  ): Promise<ExchangeRate>
}
