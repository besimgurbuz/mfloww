import { SupportedCurrencyCode } from '../supported-currency';
import { ExchangeClient, ExchangeRate } from './exchange-client.interface';

interface CurrencyLayerResponse {
  quotes: Record<string, number>;
  source: string;
  success: boolean;
  timestamp: number;
}

export class CurrencyLayerClient extends ExchangeClient {
  name = 'Currency Layer';
  readonly apiUrl = process.env.CURRENCY_LAYER_API_URL as string;
  readonly apiKey = process.env.CURRENCY_LAYER_API_KEY as string;
  readonly remainingQuotesKey = 'X-RateLimit-Remaining-Month';

  async getExchangeRates(
    baseCurrency: SupportedCurrencyCode
  ): Promise<ExchangeRate> {
    const url = new URL(`${this.apiUrl}/live`);
    url.searchParams.append('source', baseCurrency);
    url.searchParams.append('currencies', this.supportedCurrencyKeys.join(','));
    const response = await fetch(url.toString(), {
      headers: { apiKey: this.apiKey },
    });
    const jsonBody = (await response.json()) as CurrencyLayerResponse;

    return {
      base: baseCurrency,
      rates: this.convertQuotesToRates(jsonBody.source, jsonBody.quotes),
      remaining: Number(response.headers.get(this.remainingQuotesKey)),
    };
  }

  private convertQuotesToRates(
    source: string,
    quotes: Record<string, number>
  ): Record<string, number> {
    return Object.entries(quotes).reduce(
      (result: Record<string, number>, [quote, rate]) => {
        const currency = quote.replace(source, '');
        result[currency] = rate;
        return result;
      },
      {} as Record<string, number>
    );
  }
}
