import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import { CurrencyLayerResponse } from '../models/currency-layer-api.model';
import { ExchangeClient } from './exchange.client';

export class CurrencyLayerClient implements ExchangeClient {
  name = 'Currency Layer';
  private readonly API_URL = process.env.CURRENCY_LAYER_API_URL;
  private readonly API_KEY = process.env.CURRENCY_LAYER_API_KEY;
  private readonly REMAINING_KEY = 'X-RateLimit-Remaining-Month';

  constructor(private http: HttpService) {}

  getLatestExchangeRates$(
    sourceCurrency: SupportedCurrencyCode,
    targetCurrencies: SupportedCurrencyCode[]
  ): Observable<AxiosResponse<ExchangeRate>> {
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
          const result = {
            ...response,
            data: {},
          } as AxiosResponse<ExchangeRate>;
          if (response.status !== 200) {
            throw new Error(
              `Couldn't fetched latest exchanges for ${sourceCurrency}`
            );
          } else {
            result.data = {
              base: response.data.source as SupportedCurrencyCode,
              rates: this.convertQuotesToRates(
                response.data.source,
                response.data.quotes
              ),
              remaining: response.headers[this.REMAINING_KEY],
            };
          }
          return result;
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
