import { SupportedCurrency } from '@mfloww/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

export interface ExchangeClient {
  name: string;
  getLatestExchangeRates$(
    sourceCurrency: SupportedCurrency,
    targetCurrencies: SupportedCurrency[]
  ): Observable<AxiosResponse<LatestExchangeResult>>;
}

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

export type LatestExchangeResult =
  | LatestExchangeSuccessResult
  | LatestExchangeFailResult;
