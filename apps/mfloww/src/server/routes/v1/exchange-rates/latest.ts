import { defineEventHandler, getQuery } from 'h3';
import {
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from './supported-currency';

export default defineEventHandler((event) => {
  const { base } = getQuery(event);
  const baseCurrency = base?.toString().toUpperCase() as SupportedCurrencyCode;

  if (
    !SUPPORTED_CURRENCY_CODES.includes(baseCurrency as SupportedCurrencyCode)
  ) {
    throw new Error(`${baseCurrency} is not a supported currency`);
  }

  return {
    base: baseCurrency,
  };
});
