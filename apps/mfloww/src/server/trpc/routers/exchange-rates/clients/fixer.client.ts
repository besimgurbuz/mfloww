import { SupportedCurrency } from '../supported-currency';
import { ExchangeClient, ExchangeRate } from './exchange-client.interface';

export interface FixerResponse {
  base: string;
  date: Date;
  rates: Record<string, number>;
  success: boolean;
  timestamp: number;
}

export class FixerClient extends ExchangeClient {
  name = 'Fixer';
  readonly apiUrl = process.env['FIXER_API_URL'] as string;
  readonly apiKey = process.env['FIXER_API_KEY'] as string;
  remainingQuotesKey = 'x-ratelimit-remaining-month';

  async getExchangeRates(
    baseCurrency: SupportedCurrency
  ): Promise<ExchangeRate> {
    const url = new URL(`${this.apiUrl}/latest`);
    url.searchParams.append('base', baseCurrency);
    url.searchParams.append('symbols', this.supportedCurrencyKeys.join(','));

    const response = await fetch(url.toString(), {
      headers: { apiKey: this.apiKey },
    });
    const jsonBody = (await response.json()) as FixerResponse;
    return {
      base: baseCurrency,
      rates: jsonBody.rates,
      remaining: Number(response.headers.get(this.remainingQuotesKey)),
    };
  }
}
