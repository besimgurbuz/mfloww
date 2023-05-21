import { SUPPORTED_CURRENCY_LIST, SupportedCurrency } from '@mfloww/common';
import { Injectable, Logger } from '@nestjs/common';
import { Observable, catchError, map, of } from 'rxjs';
import { LatestExchangeResult } from '../clients/exchange.client';
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
    base: SupportedCurrency
  ): LatestExchangeResult | Observable<LatestExchangeResult> {
    const latestRates = this.exchangeStore.getLatestRatesBaseAs(base);
    if (latestRates === null) {
      return this.exchangeClientFactory.currrentClient
        .getLatestExchangeRates$(
          this.storeBaseCurrency as SupportedCurrency,
          SUPPORTED_CURRENCY_LIST.filter(
            (currency) => currency !== this.storeBaseCurrency
          )
        )
        .pipe(
          map((response) => {
            const ratesData = {
              base: response.data.base,
              rates: response.data.rates,
            } as LatestExchangeResult;
            this.exchangeStore.updateLatestRates(ratesData);

            return this.exchangeStore.getLatestRatesBaseAs(base);
          }),
          catchError((err) => {
            this.logger.error(`Failed to fetch exchange rates ERR: ${err}`);
            return of({
              base,
              rates: {},
            } as LatestExchangeResult);
          })
        );
    }

    return latestRates;
  }
}
