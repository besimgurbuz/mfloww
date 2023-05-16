import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CurrencyApiClientService } from '../clients/currency-api.client';
import { LatestExchangeResult } from '../clients/exchange.client';

@Controller({
  path: 'exchange',
})
export class ExchangeController {
  constructor(private fixerClient: CurrencyApiClientService) {}

  @Get('latest')
  getLatestExchangeRates(
    @Query('source') source: string,
    @Query('target') targetCurrencies: string
  ): Observable<LatestExchangeResult> {
    return this.fixerClient.getLatestExchangeRates(
      source,
      targetCurrencies.split(',')
    );
  }
}
