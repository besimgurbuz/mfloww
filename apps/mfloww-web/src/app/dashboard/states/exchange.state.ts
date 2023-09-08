import { Injectable, WritableSignal, signal } from '@angular/core';
import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class ExchangeState {
  private readonly exchangeRatesSubject: ReplaySubject<ExchangeRate> =
    new ReplaySubject(5);

  readonly exchangeRate: WritableSignal<ExchangeRate> = signal<ExchangeRate>({
    base: 'USD',
    rates: {} as Record<SupportedCurrencyCode, number>,
  });

  updateRates(exchangeRate: ExchangeRate): void {
    this.exchangeRatesSubject.next(exchangeRate);
    this.exchangeRate.set(exchangeRate);
  }

  get exchangeRate$(): Observable<ExchangeRate> {
    return this.exchangeRatesSubject.asObservable();
  }
}
