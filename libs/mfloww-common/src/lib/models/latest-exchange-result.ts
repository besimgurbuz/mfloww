import { SupportedCurrencyCode } from './supported-currency';

interface LatestExchangeSuccessResult {
  base: SupportedCurrencyCode;
  rates: Record<SupportedCurrencyCode, number>;
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
