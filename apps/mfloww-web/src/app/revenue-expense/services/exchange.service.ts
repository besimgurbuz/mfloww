import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ExchangeService {
  constructor(private http: HttpClient) {}

  getLatestExchangeRates$(
    base: SupportedCurrencyCode
  ): Observable<ExchangeRate> {
    return this.http.get<ExchangeRate>(
      `${environment.apiUrl}/api/exchange/latest?base=${base}`,
      { withCredentials: true }
    );
  }
}
