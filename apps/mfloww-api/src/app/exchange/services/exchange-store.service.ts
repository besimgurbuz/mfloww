import { SUPPORTED_CURRENY_LIST, SupportedCurrency } from '@mfloww/common';
import { Injectable } from '@nestjs/common';
import { LatestExchangeResult } from '../clients/exchange.client';

@Injectable()
export class ExchangeStoreService {
  private _latestRatesRecord: {
    lastUpdateDate: Date;
    record: LatestExchangeResult;
  } = {
    lastUpdateDate: null,
    record: null,
  };

  updateLatestRates(latestRatest: LatestExchangeResult) {
    this._latestRatesRecord.lastUpdateDate = new Date();
    this._latestRatesRecord.record = latestRatest;
  }

  getLatestRatesBaseAs(base: SupportedCurrency): LatestExchangeResult | null {
    if (!this._latestRatesRecord.record) {
      return null;
    }
    if (this._latestRates.base === base) return this._latestRates;

    const otherCurrencies = SUPPORTED_CURRENY_LIST.filter(
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
        }, {} as Record<SupportedCurrency, number>),
      },
    };
  }

  private get _latestRates(): LatestExchangeResult {
    return this._latestRatesRecord.record;
  }
}
