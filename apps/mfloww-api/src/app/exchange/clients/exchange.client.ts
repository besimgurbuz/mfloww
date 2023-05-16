import { Observable } from 'rxjs';

export interface ExchangeClient {
  getLatestExchangeRates(
    sourceCurrency: string,
    targetCurrencies: string[]
  ): Observable<LatestExchangeResult>;
}

export type LatestExchangeResult = {
  base: string;
  rates: Record<string, number>;
} & { message: string };
