import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeStoreService {
  private _cache: {
    lastUpdateDate: Date;
    record: Partial<Record<SupportedCurrencyCode, ExchangeRate>>;
  } = {
    lastUpdateDate: null,
    record: {},
  };

  updateLatestRates(latestRatest: ExchangeRate) {
    this._cache.lastUpdateDate = new Date();
    this._cache.record[latestRatest.base] = latestRatest;
  }

  getLatestRatesByBase(base: SupportedCurrencyCode): ExchangeRate | null {
    return this._cache.record[base] || null;
  }
}
