import {
  ExchangeRate,
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
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
    console.log('BASE', base);
    if (!SUPPORTED_CURRENCY_CODES.includes(base as SupportedCurrencyCode)) {
      throw new HttpException(
        `Not supported currency has given - ${base}`,
        400
      );
    }
    return this.exchangeService.getExchangeRatesFor(
      base as SupportedCurrencyCode
    );
  }
}
