import { ExchangeRate, SupportedCurrency } from '@mfloww/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

export interface ExchangeClient {
  name: string;
  getLatestExchangeRates$(
    sourceCurrency: SupportedCurrency,
    targetCurrencies: SupportedCurrency[]
  ): Observable<AxiosResponse<ExchangeRate>>;
}
