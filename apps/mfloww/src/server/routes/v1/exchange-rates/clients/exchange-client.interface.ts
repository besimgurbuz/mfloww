import {
  SUPPORTED_CURRENCIES,
  SupportedCurrencyCode,
} from '../supported-currency';

export abstract class ExchangeClient {
  abstract readonly name?: string;
  abstract readonly apiUrl: string;
  abstract readonly apiKey: string;
  abstract readonly remainingQuotesKey?: string;

  protected readonly supportedCurrencyKeys = Object.keys(SUPPORTED_CURRENCIES);

  abstract getExchangeRates(
    baseCurrency: SupportedCurrencyCode
  ): Promise<ExchangeRate>;
}

export interface ExchangeRate {
  base: SupportedCurrencyCode;
  rates: Record<SupportedCurrencyCode, number>;
  remaining?: number;
}
