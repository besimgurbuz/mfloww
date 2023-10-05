import { SupportedCurrencyCode } from '../supported-currency';
import { ExchangeClient, ExchangeRate } from './exchange-client.interface';

interface CurrencyApiResponse {
  data: Record<string, CurrencyApiCurrentRate>;
}

interface CurrencyApiCurrentRate {
  code: string;
  value: number;
}

export class CurrencyApiClient extends ExchangeClient {
  readonly name = 'Currency API';
  readonly apiUrl = process.env.CURRENCY_API_URL as string;
  readonly apiKey = process.env.CURRENCY_API_KEY as string;
  readonly remainingQuotesKey = 'x-ratelimit-remaining-quota-month';

  async getExchangeRates(
    baseCurrency: SupportedCurrencyCode
  ): Promise<ExchangeRate> {
    const url = new URL(`${this.apiUrl}/latest`);
    url.searchParams.append('apiKey', this.apiKey);
    url.searchParams.append('base_currency', baseCurrency);
    url.searchParams.append('currencies', this.supportedCurrencyKeys.join(','));

    const response = await fetch(url.toString());
    const jsonBody = (await response.json()) as CurrencyApiResponse;

    return {
      base: baseCurrency,
      rates: this.convertResponseToRateData(jsonBody.data),
      remaining: Number(response.headers.get(this.remainingQuotesKey)),
    };
  }

  private convertResponseToRateData(
    apiResponse: CurrencyApiResponse['data']
  ): Record<string, number> {
    return Object.entries(apiResponse).reduce(
      (result: Record<string, number>, [key, data]) => {
        result[key] = data.value;
        return result;
      },
      {}
    );
  }
}
