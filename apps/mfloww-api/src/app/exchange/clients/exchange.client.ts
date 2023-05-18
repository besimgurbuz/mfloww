import { SupportedCurrency } from '@mfloww/common';
import { Observable } from 'rxjs';

export interface ExchangeClient {
  getLatestExchangeRates(
    sourceCurrency: SupportedCurrency,
    targetCurrencies: SupportedCurrency[]
  ): Observable<LatestExchangeResult>;
}

export type LatestExchangeResult = {
  base: SupportedCurrency;
  rates: Record<SupportedCurrency, number>;
} & { message: string };
