import {
  ExchangeRate,
  SupportedCurrencyCode,
  getTargetCurrenciesByBase,
} from '@mfloww/common';
import { Injectable, Logger } from '@nestjs/common';
import { Observable, catchError, map, of } from 'rxjs';
import { ExchangeClientFactoryService } from './exchange-client-factory.service';
import { ExchangeStoreService } from './exchange-store.service';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);
  private readonly storeBaseCurrency = process.env.EXCHANGE_STORE_BASE_CURRENCY;

  constructor(
    private exchangeStore: ExchangeStoreService,
    private exchangeClientFactory: ExchangeClientFactoryService
  ) {}

  getExchangeRatesFor(
    base: SupportedCurrencyCode
  ): ExchangeRate | Observable<ExchangeRate> {
    const latestRates = this.exchangeStore.getLatestRatesByBase(base);
    if (!latestRates) {
      this.logger.log(`exhange store for ${base} is empty, sending request`);
      return this.exchangeClientFactory.currrentClient
        .getLatestExchangeRates$(base, getTargetCurrenciesByBase(base))
        .pipe(
          map((response) => {
            const ratesData: ExchangeRate = {
              base: response.data.base,
              rates: response.data.rates,
            };
            this.logger.log(
              `fetched exchange rates for ${base}, updating store`
            );
            this.exchangeStore.updateLatestRates(ratesData);

            return ratesData;
          }),
          catchError((err) => {
            this.logger.error(`Failed to fetch exchange rates ERR: ${err}`);
            return of({
              base,
              rates: {},
            } as ExchangeRate);
          })
        );
    }

    this.logger.log(`exhange store for ${base} has found using the store`);
    return latestRates;
  }
}
