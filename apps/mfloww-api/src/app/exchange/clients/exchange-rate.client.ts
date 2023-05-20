import { SupportedCurrency } from '@mfloww/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import { ExchangeRateResponse } from '../models/exchange-rate-api.model';
import { ExchangeClient, LatestExchangeResult } from './exchange.client';

export class ExchangeRateClient implements ExchangeClient {
  name = 'Exchange Rate';
  private readonly API_URL = process.env.EXCHANGE_RATE_API_URL;
  private readonly API_KEY = process.env.EXCHANGE_RATE_API_KEY;

  constructor(private http: HttpService) {}

  getLatestExchangeRates$(
    sourceCurrency: SupportedCurrency,
    targetCurrencies: SupportedCurrency[]
  ): Observable<AxiosResponse<LatestExchangeResult>> {
    return this.http
      .get<ExchangeRateResponse>(`${this.API_URL}/latest`, {
        params: { base: sourceCurrency, symbols: targetCurrencies.join(',') },
        headers: {
          apikey: this.API_KEY,
        },
      })
      .pipe(
        map((response) => {
          const result = {
            ...response,
            data: {},
          } as AxiosResponse<LatestExchangeResult>;
          if (response.status !== 200) {
            result.data = {
              message: `Couldn't fetched latest exchanges for ${sourceCurrency}`,
            };
          } else {
            result.data = {
              base: response.data.base as SupportedCurrency,
              rates: response.data.rates,
            };
          }
          return result;
        })
      );
  }
}
