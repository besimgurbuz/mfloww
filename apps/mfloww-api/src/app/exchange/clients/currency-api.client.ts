import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, catchError, map, of } from 'rxjs';
import { CurrencyApiResponse } from '../models/currency-api.model';
import { ExchangeClient, LatestExchangeResult } from './exchange.client';

@Injectable()
export class CurrencyApiClientService implements ExchangeClient {
  private readonly API_URL = process.env.CURRENCY_API_URL;
  private readonly API_KEY = process.env.CURRENCY_API_KEY;

  constructor(private http: HttpService) {}

  getLatestExchangeRates(
    sourceCurrency: string,
    targetCurrencies: string[]
  ): Observable<LatestExchangeResult> {
    return this.http
      .get<CurrencyApiResponse>(`${this.API_URL}/latest`, {
        params: {
          base_currency: sourceCurrency,
          currencies: targetCurrencies,
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
            base: sourceCurrency,
            rates: this.convertResponseToRateData(response.data.data),
          } as LatestExchangeResult;
        }),
        catchError((err) => {
          console.log(err);
          return of({
            message: 'API error: currencyapi',
          } as LatestExchangeResult);
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
