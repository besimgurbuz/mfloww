import { SupportedCurrency } from '@mfloww/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
import { CurrencyApiResponse } from '../models/currency-api.model';
import { ExchangeClient, LatestExchangeResult } from './exchange.client';

export class CurrencyApiClient implements ExchangeClient {
  name = 'Currency API';
  private readonly API_URL = process.env.CURRENCY_API_URL;
  private readonly API_KEY = process.env.CURRENCY_API_KEY;
  private readonly API_REMAINING_KEY = 'x-ratelimit-remaining-quota-month';

  constructor(private http: HttpService) {}

  getLatestExchangeRates$(
    sourceCurrency: SupportedCurrency,
    targetCurrencies: SupportedCurrency[]
  ): Observable<AxiosResponse<LatestExchangeResult>> {
    return this.http
      .get<CurrencyApiResponse>(`${this.API_URL}/latest`, {
        params: {
          apikey: this.API_KEY,
          base_currency: sourceCurrency,
          currencies: targetCurrencies.join(','),
        },
      })
      .pipe(
        map((response) => {
          const result = {
            ...response,
            data: {},
          } as AxiosResponse<LatestExchangeResult>;
          if (result.status !== 200) {
            result.data = {
              message: `Couldn't fetched exchange rates for ${sourceCurrency}`,
            };
          } else {
            result.data = {
              base: sourceCurrency,
              rates: this.convertResponseToRateData(response.data.data),
              remaining: response.headers[this.API_REMAINING_KEY],
            };
          }
          return result;
        })
      );
  }

  private convertResponseToRateData(
    apiResponse: CurrencyApiResponse['data']
  ): Record<string, number> {
    return Object.entries(apiResponse).reduce(
      (result: Record<string, number>, [key, data]) => {
        result[key] = data.value;
        return result;
      },
      {}
    );
  }
}
