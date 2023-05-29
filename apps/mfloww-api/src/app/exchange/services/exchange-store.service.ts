import {
  ExchangeRate,
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from '@mfloww/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeStoreService {
  private _latestRatesRecord: {
    lastUpdateDate: Date;
    record: ExchangeRate;
  } = {
    lastUpdateDate: null,
    record: null,
  };

  updateLatestRates(latestRatest: ExchangeRate) {
    this._latestRatesRecord.lastUpdateDate = new Date();
    this._latestRatesRecord.record = latestRatest;
  }

  getLatestRatesBaseAs(base: SupportedCurrencyCode): ExchangeRate | null {
    if (!this._latestRatesRecord.record) {
      return null;
    }
    if (this._latestRates.base === base) return this._latestRates;

    const otherCurrencies = SUPPORTED_CURRENCY_CODES.filter(
      (currency) => currency !== base
    );
    const baseValueOnLatestBase = this._latestRates.rates[base];

    return {
      base,
      rates: {
        ...otherCurrencies.reduce((ratesMap, currency) => {
          ratesMap[currency] =
            (this._latestRates.rates[currency] | 1) / baseValueOnLatestBase;
          return ratesMap;
        }, {} as Record<SupportedCurrencyCode, number>),
      },
    };
  }

  private get _latestRates(): ExchangeRate {
    return this._latestRatesRecord.record;
  }
}
