import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CurrencyLayerResponse } from '../models/currency-layer-api.model';
import { ExchangeClient, LatestExchangeResult } from './exchange.client';

@Injectable()
export class CurrencyLayerClient implements ExchangeClient {
  private readonly API_URL = process.env.CURRENCY_LAYER_API_URL;
  private readonly API_KEY = process.env.CURRENCY_LAYER_API_KEY;

  constructor(private http: HttpService) {}

  getLatestExchangeRates(
    sourceCurrency: string,
    targetCurrencies: string[]
  ): Observable<LatestExchangeResult> {
    return this.http
      .get<CurrencyLayerResponse>(`${this.API_URL}/live`, {
        params: {
          source: sourceCurrency,
          currencies: targetCurrencies.join(','),
        },
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
            base: response.data.source,
            rates: this.convertQuotesToRates(
              response.data.source,
              response.data.quotes
            ),
          } as LatestExchangeResult;
        })
      );
  }

  private convertQuotesToRates(
    source: string,
    quotes: Record<string, number>
  ): Record<string, number> {
    return Object.entries(quotes).reduce(
      (result: Record<string, number>, [quote, rate]) => {
        const currency = quote.replace(source, '');
        result[currency] = rate;
        return result;
      },
      {} as Record<string, number>
    );
  }
}
