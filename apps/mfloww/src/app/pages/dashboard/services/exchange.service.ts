import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ExchangeService {
  private http = inject(HttpClient);

  getLatestExchangeRates$(
    base: SupportedCurrencyCode
  ): Observable<ExchangeRate> {
    return this.http.get<ExchangeRate>(
      `${environment.apiUrl}/api/v1/exchange-rates/latest?base=${base}`
    );
  }
}
