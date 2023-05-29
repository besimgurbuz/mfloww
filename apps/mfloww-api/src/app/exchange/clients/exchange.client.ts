import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

export interface ExchangeClient {
  name: string;
  getLatestExchangeRates$(
    sourceCurrency: SupportedCurrencyCode,
    targetCurrencies: SupportedCurrencyCode[]
  ): Observable<AxiosResponse<ExchangeRate>>;
}
