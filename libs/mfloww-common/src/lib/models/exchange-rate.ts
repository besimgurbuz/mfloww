import { SupportedCurrencyCode } from './supported-currency';

export interface ExchangeRate {
  base: SupportedCurrencyCode;
  rates: Record<SupportedCurrencyCode, number>;
  remaining?: number;
}
