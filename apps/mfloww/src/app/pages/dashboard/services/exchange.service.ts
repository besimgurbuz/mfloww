import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { Observable } from 'rxjs';

@Injectable()
export class ExchangeService {
  private http = inject(HttpClient);

  getLatestExchangeRates$(
    base: SupportedCurrencyCode
  ): Observable<ExchangeRate> {
    return this.http.get<ExchangeRate>(
      `${import.meta.env['VITE_API_URL']}/exchange-rates/latest?base=${base}`
    );
  }
}
