import { SupportedCurrency } from '@mfloww/common';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, catchError, tap } from 'rxjs';
import { ClientInstanceContainer } from '../models/client-instance-container';
import { CurrencyApiClientService } from './currency-api.client';
import { CurrencyLayerClientService } from './currency-layer.client';
import { ExchangeRateClientService } from './exchange-rate.client';
import { LatestExchangeResult } from './exchange.client';
import { FixerClientService } from './fixer.client';

@Injectable()
export class ClientFactory {
  private readonly logger = new Logger(ClientFactory.name);
  private readonly _clients: ClientInstanceContainer[] = [];

  constructor(
    private currencyApiClient: CurrencyApiClientService,
    private currencyLayerClient: CurrencyLayerClientService,
    private exhangeRateClient: ExchangeRateClientService,
    private fixerClient: FixerClientService
  ) {
    this._clients = [
      new ClientInstanceContainer(currencyApiClient, 300, null),
      new ClientInstanceContainer(currencyLayerClient, 100, null),
      new ClientInstanceContainer(exhangeRateClient, 250, null),
      new ClientInstanceContainer(fixerClient, 100, null),
    ];
  }

  getLatestExchangesFromAvailableClient$(
    source: SupportedCurrency,
    currencies: SupportedCurrency[]
  ): Observable<AxiosResponse<LatestExchangeResult>> {
    const client = this._clients.find((clientContiner) =>
      clientContiner.isAvailable()
    );

    if (!client) {
      throw new Error('Cant find available client to request exchange rates');
    }

    client.updateLastUsage(new Date());
    return client.instance.getLatestExchangeRates(source, currencies).pipe(
      tap((response) => {
        if (response.data?.remaining) {
          client.updateRemainingCalls(response.data.remaining);
        }
      }),
      catchError((err) => {
        this.logger.debug(
          `Failed to get exchange rates from ${client.instance.name}`
        );
        this.logger.error(err);

        client.disableClient();
        return this.getLatestExchangesFromAvailableClient$(source, currencies);
      })
    );
  }
}
