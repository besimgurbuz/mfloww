import { SUPPORTED_CURRENY_LIST, SupportedCurrency } from '@mfloww/common';
import { Injectable, Logger } from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { LatestExchangeResult } from '../clients/exchange.client';
import { ExchangeClientFactoryService } from './exchange-client-factory.service';
import { ExchangeStoreService } from './exchange-store.service';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);
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
          base,
          SUPPORTED_CURRENY_LIST.filter((currency) => currency !== base)
        )
        .pipe(
          map(
            (response) =>
              ({
                base: response.data.base,
                rates: response.data.rates,
              } as LatestExchangeResult)
          ),
          tap((latestExchangeRates) =>
            this.exchangeStore.updateLatestRates(latestExchangeRates)
          ),
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
