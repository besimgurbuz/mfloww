import { Injectable } from '@nestjs/common';
import { LatestExchangeResult } from './clients/exchange.client';

@Injectable()
export class ExchangeStore {
  private _latestRates: LatestExchangeResult;
}
