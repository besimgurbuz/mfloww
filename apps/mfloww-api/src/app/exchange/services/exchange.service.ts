import {
  ExchangeRate,
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
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
    if (latestRates === null) {
      return this.exchangeClientFactory.currrentClient
        .getLatestExchangeRates$(
          base,
          SUPPORTED_CURRENCY_CODES.filter(
            (currency) => currency !== this.storeBaseCurrency
          )
        )
        .pipe(
          map((response) => {
            const ratesData: ExchangeRate = {
              base: response.data.base,
              rates: response.data.rates,
            };
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

    return latestRates;
  }
}
