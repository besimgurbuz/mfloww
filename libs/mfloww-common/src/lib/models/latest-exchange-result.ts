import { SupportedCurrency } from './supported-currency';

interface LatestExchangeSuccessResult {
  base: SupportedCurrency;
  rates: Record<SupportedCurrency, number>;
  remaining?: number;
  message?: never;
}

interface LatestExchangeFailResult {
  base?: never;
  rates?: never;
  remaining?: never;
  message: string;
}

export type ExchangeRate =
  | LatestExchangeSuccessResult
  | LatestExchangeFailResult;
