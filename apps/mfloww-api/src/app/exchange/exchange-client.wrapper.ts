import { SupportedCurrencyCode } from '@mfloww/common';
import { tap } from 'rxjs';
import { ExchangeClient } from './clients/exchange.client';

export class ExchangeClientWrapper {
  private _remainingCalls: number;
  constructor(
    private _client: ExchangeClient,
    private _callQouta: number,
    private _lastUsageDate: Date
  ) {
    this._remainingCalls = _callQouta;
  }

  get lastUsageDate(): Date {
    return this._lastUsageDate;
  }

  get name(): string {
    return this._client.name;
  }

  getLatestExchangeRates$(
    source: SupportedCurrencyCode,
    currencies: SupportedCurrencyCode[]
  ) {
    return this._client.getLatestExchangeRates$(source, currencies).pipe(
      tap((response) => {
        this.updateLastUsage(new Date());
        if (response.data?.remaining) {
          this.updateRemainingCalls(response.data.remaining);
        } else {
          this.decreaseRemainingCalls();
        }
      })
    );
  }

  isAvailable(): boolean {
    return this._remainingCalls > 0;
  }

  updateRemainingCalls(newValue: number) {
    this._remainingCalls = newValue;
  }

  decreaseRemainingCalls() {
    this._remainingCalls = this._remainingCalls - 1;
  }

  resetRemaningCalls(): void {
    this._remainingCalls = this._callQouta;
  }

  updateLastUsage(date: Date) {
    this._lastUsageDate = date;
  }
}
