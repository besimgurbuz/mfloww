import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ClientWrapper } from './client.wrapper';
import { CurrencyApiClient } from './clients/currency-api.client';
import { CurrencyLayerClient } from './clients/currency-layer.client';
import { ExchangeRateClient } from './clients/exchange-rate.client';
import { FixerClient } from './clients/fixer.client';

@Injectable()
export class ClientFactory {
  private readonly logger = new Logger(ClientFactory.name);
  private readonly _clientWrappers: ClientWrapper[] = [];

  constructor(http: HttpService) {
    this._clientWrappers = [
      new ClientWrapper(new CurrencyApiClient(http), 300, null),
      new ClientWrapper(new CurrencyLayerClient(http), 100, null),
      new ClientWrapper(new ExchangeRateClient(http), 250, null),
      new ClientWrapper(new FixerClient(http), 100, null),
    ];
  }

  getAvailableClientWrapper(): ClientWrapper | null {
    const clientContainer = this._clientWrappers[0];

    if (!clientContainer.isAvailable()) {
      this.refreshClientList();
      this.logger.debug(
        `${clientContainer.name} is now unavailable, started using ${this._clientWrappers[0].name}`
      );
      if (!this._clientWrappers[0].isAvailable())
        this._clientWrappers[0].resetRemaningCalls();

      return this._clientWrappers[0];
    }
    this.logger.debug(`Using ${clientContainer.name} as exchange client`);

    return clientContainer;
  }

  refreshClientList(): void {
    for (let i = 1; i < this._clientWrappers.length; i++) {
      const temp = this._clientWrappers[i - 1];
      this._clientWrappers[i - 1] = this._clientWrappers[i];
      this._clientWrappers[i] = temp;
    }
  }
}
