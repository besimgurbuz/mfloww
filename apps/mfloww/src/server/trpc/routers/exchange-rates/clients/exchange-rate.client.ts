import { SupportedCurrency } from '../supported-currency';
import { ExchangeClient, ExchangeRate } from './exchange-client.interface';

interface ExchangeRateClientResponse {
  base: string;
  date: Date;
  rates: Record<string, number>;
  success: boolean;
  timestamp: number;
}

export class ExchangeRateClient extends ExchangeClient {
  name = 'Exchange Rate';
  apiUrl = process.env['EXCHANGE_RATE_API_URL'] as string;
  apiKey = process.env['EXCHANGE_RATE_API_KEY'] as string;
  remainingQuotesKey?: string;

  async getExchangeRates(
    baseCurrency: SupportedCurrency
  ): Promise<ExchangeRate> {
    const url = new URL(`${this.apiUrl}/latest`);
    url.searchParams.set('base', baseCurrency);
    url.searchParams.set('symbols', this.supportedCurrencyKeys.join(','));

    const response = await fetch(url.toString(), {
      headers: { apiKey: this.apiKey },
    });
    const jsonBody = (await response.json()) as ExchangeRateClientResponse;

    return {
      base: baseCurrency,
      rates: jsonBody.rates,
    };
  }
}
