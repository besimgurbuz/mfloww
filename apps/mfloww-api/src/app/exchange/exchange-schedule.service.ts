import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ExchangeScheduleService {
  private readonly logger = new Logger(ExchangeScheduleService.name);

  @Cron(CronExpression.EVERY_2_HOURS)
  updateExchangeRates() {
    this.logger.debug('Starting to update exchange rates');
  }
}
