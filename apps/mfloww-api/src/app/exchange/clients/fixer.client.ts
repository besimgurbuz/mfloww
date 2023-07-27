import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import { FixerResponse } from '../models/fixer-api.model';
import { ExchangeClient } from './exchange.client';

export class FixerClient implements ExchangeClient {
  name = 'Fixer';
  private readonly API_URL = process.env.FIXER_API_URL;
  private readonly API_KEY = process.env.FIXER_API_KEY;
  private readonly REMANINING_KEY = 'X-RateLimit-Remaining-Month';

  constructor(private http: HttpService) {}

  getLatestExchangeRates$(
    sourceCurrency: SupportedCurrencyCode,
    targetCurrencies: SupportedCurrencyCode[]
  ): Observable<AxiosResponse<ExchangeRate>> {
    return this.http
      .get<FixerResponse>(`${this.API_URL}/latest`, {
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
              remaining: response.headers[this.REMANINING_KEY],
            },
          };
        })
      );
  }
}
