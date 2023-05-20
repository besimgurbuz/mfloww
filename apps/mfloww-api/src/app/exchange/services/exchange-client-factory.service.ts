import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { CurrencyApiClient } from '../clients/currency-api.client';
import { CurrencyLayerClient } from '../clients/currency-layer.client';
import { ExchangeRateClient } from '../clients/exchange-rate.client';
import { FixerClient } from '../clients/fixer.client';
import { ExchangeClientWrapper } from '../exchange-client.wrapper';

@Injectable()
export class ExchangeClientFactoryService {
  private readonly logger = new Logger(ExchangeClientFactoryService.name);
  private readonly _clientWrappers: ExchangeClientWrapper[] = [];

  constructor(http: HttpService) {
    this._clientWrappers = [
      new ExchangeClientWrapper(new CurrencyApiClient(http), 300, null),
      new ExchangeClientWrapper(new CurrencyLayerClient(http), 100, null),
      new ExchangeClientWrapper(new ExchangeRateClient(http), 250, null),
      new ExchangeClientWrapper(new FixerClient(http), 100, null),
    ];
  }

  getAvailableClientWrapper(): ExchangeClientWrapper {
    const clientContainer = this._clientWrappers[0];

    if (!clientContainer.isAvailable()) {
      this.refreshClientList();
      this.logger.debug(
        `${clientContainer.name} is now unavailable, started using ${this._clientWrappers[0].name}`
      );

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
    if (!this._clientWrappers[0].isAvailable()) {
      this._clientWrappers[0].resetRemaningCalls();
    }
  }

  get currrentClient(): ExchangeClientWrapper {
    return this._clientWrappers[0];
  }

  getNextClient(index = 0): ExchangeClientWrapper {
    return this._clientWrappers[index + 1];
  }
}
