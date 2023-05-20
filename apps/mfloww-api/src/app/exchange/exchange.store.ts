import { SupportedCurrency } from '@mfloww/common';
import { Injectable } from '@nestjs/common';
import { LatestExchangeResult } from './clients/exchange.client';

@Injectable()
export class ExchangeStore {
  private _latestRates: LatestExchangeResult;

  updateLatestRates(latestRatest: LatestExchangeResult) {
    this._latestRates = latestRatest;
  }

  getLatestRatesBaseAs(base: SupportedCurrency): LatestExchangeResult | null {
    if (!this._latestRates) {
      return null;
    }
    if (this._latestRates.base === base) return this._latestRates;
  }
}
