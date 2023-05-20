import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ClientFactory } from './client.factory';
import { ExchangeController } from './controllers/exchange.controller';
import { ExchangeScheduleService } from './exchange-schedule.service';
import { ExchangeStore } from './exchange.store';

@Module({
  imports: [CoreModule],
  controllers: [ExchangeController],
  providers: [ExchangeScheduleService, ClientFactory, ExchangeStore],
})
export class ExchangeModule {}
