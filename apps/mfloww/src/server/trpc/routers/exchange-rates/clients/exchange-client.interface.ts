import { SUPPORTED_CURRENCIES, SupportedCurrency } from '../supported-currency';

export abstract class ExchangeClient {
  abstract readonly name?: string;
  abstract readonly apiUrl: string;
  abstract readonly apiKey: string;
  abstract readonly remainingQuotesKey?: string;

  protected readonly supportedCurrencyKeys = SUPPORTED_CURRENCIES;

  abstract getExchangeRates(
    baseCurrency: SupportedCurrency
  ): Promise<ExchangeRate>;
}

export interface ExchangeRate {
  base: SupportedCurrency;
  rates: Record<SupportedCurrency, number>;
  remaining?: number;
}
