import { SUPPORTED_CURRENY_LIST, SupportedCurrency } from '@mfloww/common';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { catchError } from 'rxjs';
import { ClientFactory } from './client.factory';
import { ExchangeStore } from './exchange.store';

@Injectable()
export class ExchangeScheduleService {
  private readonly storeCurrencyBase = process.env
    .EXCHANGE_STORE_BASE_CURRENCY as SupportedCurrency;
  private readonly logger = new Logger(ExchangeScheduleService.name);

  constructor(
    private clientFactory: ClientFactory,
    private exchangeStore: ExchangeStore
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  updateExchangeRates(): void {
    this.logger.debug('Starting to update exchange rates');
    let availableClientWrapper = this.clientFactory.getAvailableClientWrapper();

    availableClientWrapper
      .getLatestExchangeRates$(this.storeCurrencyBase, SUPPORTED_CURRENY_LIST)
      .pipe(
        catchError((err) => {
          this.logger.error(err);
          this.clientFactory.refreshClientList();
          availableClientWrapper =
            this.clientFactory.getAvailableClientWrapper();
          return availableClientWrapper.getLatestExchangeRates$(
            this.storeCurrencyBase,
            SUPPORTED_CURRENY_LIST
          );
        })
      )
      .subscribe((response) => {
        this.exchangeStore.updateLatestRates(response.data);
      });
  }
}
