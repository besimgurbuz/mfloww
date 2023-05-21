import {
  ExchangeRate,
  SUPPORTED_CURRENCY_LIST,
  SupportedCurrency,
} from '@mfloww/common';
import {
  Controller,
  Get,
  HttpException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExchangeService } from '../services/exchange.service';

@Controller({
  path: 'exchange',
})
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get('latest')
  @UseGuards(JwtAuthGuard)
  getLatestExchangeRates(
    @Query('base') base?: string
  ): ExchangeRate | Observable<ExchangeRate> {
    if (!SUPPORTED_CURRENCY_LIST.includes(base as SupportedCurrency)) {
      throw new HttpException(
        `Not supported currency has given - ${base}`,
        400
      );
    }
    return this.exchangeService.getExchangeRatesFor(base as SupportedCurrency);
  }
}
