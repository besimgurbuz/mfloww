import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { CurrencyApiClientService } from './clients/currency-api.client';
import { CurrencyLayerClient } from './clients/currency-layer.client';
import { ExchangeRateClientService } from './clients/exchange-rate.client';
import { FixerClientService } from './clients/fixer.client';
import { ExchangeController } from './controllers/exchange.controller';

@Module({
  imports: [CoreModule],
  controllers: [ExchangeController],
  providers: [
    CurrencyApiClientService,
    CurrencyLayerClient,
    ExchangeRateClientService,
    FixerClientService,
  ],
})
export class ExchangeModule {}
