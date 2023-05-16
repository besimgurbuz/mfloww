import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ExchangeRateResponse } from '../models/exchange-rate-api.model';
import { ExchangeClient, LatestExchangeResult } from './exchange.client';

@Injectable()
export class ExchangeRateClientService implements ExchangeClient {
  private readonly API_URL = process.env.EXCHANGE_RATE_API_URL;
  private readonly API_KEY = process.env.EXCHANGE_RATE_API_KEY;

  constructor(private http: HttpService) {}

  getLatestExchangeRates(
    sourceCurrency: string,
    targetCurrencies: string[]
  ): Observable<LatestExchangeResult> {
    return this.http
      .get<ExchangeRateResponse>(`${this.API_URL}/latest`, {
        params: { base: sourceCurrency, symbols: targetCurrencies.join(',') },
        headers: {
          apikey: this.API_KEY,
        },
      })
      .pipe(
        map((response) => {
          if (response.status !== 200) {
            return {
              message: `Couldn't fetched latest exchanges for ${sourceCurrency}`,
            } as LatestExchangeResult;
          }
          return {
            base: response.data.base,
            rates: response.data.rates,
          } as LatestExchangeResult;
        })
      );
  }
}
