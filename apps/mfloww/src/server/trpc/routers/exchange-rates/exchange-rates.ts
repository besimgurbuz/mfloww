import { CurrencyApiClient } from './clients/currency-api.client';
import { CurrencyLayerClient } from './clients/currency-layer.client';
import { ExchangeRate } from './clients/exchange-client.interface';
import { ExchangeRateClient } from './clients/exchange-rate.client';
import { FixerClient } from './clients/fixer.client';
import { SupportedCurrency } from './supported-currency';

export const exchangeRates = () => {
  const clients = [
    new CurrencyApiClient(),
    new CurrencyLayerClient(),
    new ExchangeRateClient(),
    new FixerClient(),
  ] as const;
  let currentClient = 0;
  const cache: Partial<Record<SupportedCurrency, ExchangeRate>> = {};
  const lastFetchMap: Partial<Record<SupportedCurrency, Date>> = {};

  async function fetchLatestRates(
    baseCurrency: SupportedCurrency
  ): Promise<ExchangeRate> {
    try {
      const exchangeRates = await clients[currentClient].getExchangeRates(
        baseCurrency
      );
      delete exchangeRates.rates[baseCurrency];
      return exchangeRates as ExchangeRate;
    } catch (error) {
      if (currentClient < clients.length - 1) {
        currentClient++;
        return await fetchLatestRates(baseCurrency);
      }
      throw error;
    }
  }

  function shouldRefresh(baseCurrency: SupportedCurrency) {
    if (!lastFetchMap[baseCurrency]) {
      return true;
    }
    return (
      Date.now() - (lastFetchMap[baseCurrency] as Date).getTime() >
      1000 * 60 * 60 * 2
    );
  }

  return async (baseCurrency: SupportedCurrency): Promise<ExchangeRate> => {
    if (cache[baseCurrency] && !shouldRefresh(baseCurrency)) {
      return cache[baseCurrency] as ExchangeRate;
    }

    const exchangeRate = await fetchLatestRates(baseCurrency);
    cache[baseCurrency] = exchangeRate;
    lastFetchMap[baseCurrency] = new Date();

    return exchangeRate;
  };
};
