import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ExchangeController } from './controllers/exchange.controller';
import { ExchangeClientFactoryService } from './services/exchange-client-factory.service';
import { ExchangeScheduleService } from './services/exchange-schedule.service';
import { ExchangeStoreService } from './services/exchange-store.service';
import { ExchangeService } from './services/exchange.service';

@Module({
  imports: [CoreModule],
  controllers: [ExchangeController],
  providers: [
    ExchangeScheduleService,
    ExchangeClientFactoryService,
    ExchangeService,
    ExchangeStoreService,
  ],
})
export class ExchangeModule {}
