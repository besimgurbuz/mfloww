import { Injectable } from '@angular/core';
import { ExchangeRate } from '@mfloww/common';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class ExchangeState {
  private readonly exchangeRatesSubject: ReplaySubject<ExchangeRate> =
    new ReplaySubject(5);

  updateRates(newRates: ExchangeRate): void {
    this.exchangeRatesSubject.next(newRates);
  }

  get exchangeRate$(): Observable<ExchangeRate> {
    return this.exchangeRatesSubject.asObservable();
  }
}
