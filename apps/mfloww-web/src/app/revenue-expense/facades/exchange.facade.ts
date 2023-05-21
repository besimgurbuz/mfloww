import { Injectable } from '@angular/core';
import { ExchangeRate, SupportedCurrency } from '@mfloww/common';
import { Observable, Subscription, switchMap, tap, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../core/local-storage.service';
import { ExchangeService } from '../services/exchange.service';
import { ExchangeState } from '../states/exchange.state';

@Injectable()
export class ExchangeFacade {
  private readonly tenMinutesAsMS = 1000 * 60 * 10;

  constructor(
    private exchangeService: ExchangeService,
    private exchangeState: ExchangeState,
    private localStorageService: LocalStorageService
  ) {}

  loadExchangeRateInterval(): Subscription {
    return timer(0, this.tenMinutesAsMS)
      .pipe(
        tap(() => console.log('refreshing exchange rates')),
        switchMap(() =>
          this.exchangeService.getLatestExchangeRates$(this.baseCurrency)
        )
      )
      .subscribe({
        error: (err) =>
          console.error(`failed to refresh exchange rates ERR: ${err}`),
        next: (exchangeRate) => {
          this.exchangeState.updateRates(exchangeRate);
          console.log('exchange rates successfully refreshed');
        },
      });
  }

  get exchangeRate$(): Observable<ExchangeRate> {
    return this.exchangeState.exchangeRate$;
  }

  get baseCurrency(): SupportedCurrency {
    return this.localStorageService.get(environment.baseCurrencyKey) || 'USD';
  }
}
