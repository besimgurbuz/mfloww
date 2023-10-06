import { createError, defineEventHandler, getQuery, sendError } from 'h3';
import { environment } from '../../../../environments/environment';
import { exchangeRates } from './exchange-rates';
import {
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from './supported-currency';

const exchangeRateProvider = exchangeRates();

export default defineEventHandler(async (event) => {
  const { base } = getQuery(event);
  const baseCurrency = base?.toString().toUpperCase() as SupportedCurrencyCode;

  if (
    !SUPPORTED_CURRENCY_CODES.includes(baseCurrency as SupportedCurrencyCode)
  ) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: `${base} is not a supported currency`,
      }),
      !environment.production
    );
  }

  return await exchangeRateProvider(baseCurrency);
});
