import { SUPPORTED_CURRENCY_LIST, SupportedCurrency } from '@mfloww/common';
import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LatestExchangeResult } from '../clients/exchange.client';
import { ExchangeService } from '../services/exchange.service';

@Controller({
  path: 'exchange',
})
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get('latest')
  getLatestExchangeRates(
    @Query('base') base?: string
  ): LatestExchangeResult | Observable<LatestExchangeResult> {
    if (!SUPPORTED_CURRENCY_LIST.includes(base as SupportedCurrency)) {
      throw new HttpException(
        `Not supported currency has given - ${base}`,
        400
      );
    }
    return this.exchangeService.getExchangeRatesFor(base as SupportedCurrency);
  }
}
