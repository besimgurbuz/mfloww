import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import { ExchangeRateClientResponse } from '../models/exchange-rate-api.model';
import { ExchangeClient } from './exchange.client';

export class ExchangeRateClient implements ExchangeClient {
  name = 'Exchange Rate';
  private readonly API_URL = process.env.EXCHANGE_RATE_API_URL;
  private readonly API_KEY = process.env.EXCHANGE_RATE_API_KEY;

  constructor(private http: HttpService) {}

  getLatestExchangeRates$(
    sourceCurrency: SupportedCurrencyCode,
    targetCurrencies: SupportedCurrencyCode[]
  ): Observable<AxiosResponse<ExchangeRate>> {
    return this.http
      .get<ExchangeRateClientResponse>(`${this.API_URL}/latest`, {
        params: { base: sourceCurrency, symbols: targetCurrencies.join(',') },
        headers: {
          apikey: this.API_KEY,
        },
      })
      .pipe(
        map((response) => {
          if (response.status !== 200) {
            throw new Error(
              `Couldn't fetched latest exchanges for ${sourceCurrency}`
            );
          }
          return {
            ...response,
            data: {
              base: response.data.base as SupportedCurrencyCode,
              rates: response.data.rates,
            },
          };
        })
      );
  }
}
