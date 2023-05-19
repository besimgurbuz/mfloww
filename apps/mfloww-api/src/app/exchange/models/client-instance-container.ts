import { ExchangeClient } from '../clients/exchange.client';

export class ClientInstanceContainer {
  private _available = false;

  constructor(
    private _client: ExchangeClient,
    private _remainingCalls: number,
    private _lastUsageDate: Date
  ) {}

  get instance(): ExchangeClient {
    return this._client;
  }

  get lastUsageDate(): Date {
    return this._lastUsageDate;
  }

  isAvailable(): boolean {
    return this._available && this._remainingCalls > 0;
  }

  updateRemainingCalls(newValue: number) {
    this._remainingCalls = newValue;
  }

  updateLastUsage(date: Date) {
    this._lastUsageDate = date;
  }

  enableClient() {
    this.setAvailable(true);
  }

  disableClient() {
    this.setAvailable(false);
  }

  setAvailable(status: boolean) {
    this._available = status;
  }
}
