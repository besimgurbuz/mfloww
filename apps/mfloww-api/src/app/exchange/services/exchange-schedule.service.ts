import {
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from '@mfloww/common';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExchangeClientWrapper } from '../exchange-client.wrapper';
import { ExchangeClientFactoryService } from './exchange-client-factory.service';
import { ExchangeStoreService } from './exchange-store.service';

@Injectable()
export class ExchangeScheduleService {
  private readonly storeCurrencyBase = process.env
    .EXCHANGE_STORE_BASE_CURRENCY as SupportedCurrencyCode;
  private readonly logger = new Logger(ExchangeScheduleService.name);
  private readonly completeLogFn = (wrapper: ExchangeClientWrapper) =>
    this.logger.log(
      `Completed exchange rate update event with: ${wrapper.name}`
    );

  constructor(
    private clientFactory: ExchangeClientFactoryService,
    private exchangeStore: ExchangeStoreService
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  updateExchangeRates(): void {
    this.logger.debug(
      `Starting to update exchange rates, BASE: ${this.storeCurrencyBase}`
    );
    const availableClientWrapper =
      this.clientFactory.getAvailableClientWrapper();

    availableClientWrapper
      .getLatestExchangeRates$(this.storeCurrencyBase, SUPPORTED_CURRENCY_CODES)
      .subscribe({
        error: (err) => {
          this.logger.error(
            `Cannot fetched exchange rates with ${availableClientWrapper.name} ERR: ${err}`
          );
          this.updateRatesWithNextClient();
        },
        next: (response) => {
          this.exchangeStore.updateLatestRates(response.data);
        },
        complete: () => this.completeLogFn(availableClientWrapper),
      });
  }

  updateRatesWithNextClient(currentClientIndex = 0): void {
    const nextClient = this.clientFactory.getNextClient(currentClientIndex);

    if (!nextClient) {
      this.logger.error(`Failed to update exchange rates`);
      return;
    }

    nextClient
      .getLatestExchangeRates$(this.storeCurrencyBase, SUPPORTED_CURRENCY_CODES)
      .subscribe({
        error: (err) => {
          this.logger.error(
            `Failed to update exchange rates with the client: ${nextClient.name} ERR: ${err}`
          );
          this.logger.log('Moving to next client');
          this.updateRatesWithNextClient(++currentClientIndex);
        },
        next: (response) => {
          this.exchangeStore.updateLatestRates(response.data);
        },
        complete: () => this.completeLogFn(nextClient),
      });
  }
}
