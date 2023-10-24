import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { Observable } from 'rxjs';
import { injectTrpcClient } from '../../../../trpc-client';

@Injectable()
export class ExchangeService {
  private trpcClient = injectTrpcClient();
  private http = inject(HttpClient);

  getLatestExchangeRates$(
    base: SupportedCurrencyCode
  ): Observable<ExchangeRate> {
    return this.trpcClient.exchangeRate.latest.query({
      baseCurrency: base,
    }) as Observable<ExchangeRate>;
  }
}
