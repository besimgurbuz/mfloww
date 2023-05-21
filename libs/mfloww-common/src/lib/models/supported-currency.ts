const SUPPORTED_CURRENCY = {
  USD: 'USD',
  EUR: 'EUR',
  CNY: 'CNY',
  GBP: 'GBP',
  INR: 'INR',
  CHF: 'CHF',
  TRY: 'TRY',
  RUB: 'RUB',
} as const;

type ObjectValues<T> = T[keyof T];
export type SupportedCurrency = ObjectValues<typeof SUPPORTED_CURRENCY>;

export const SUPPORTED_CURRENCY_LIST = Object.values(SUPPORTED_CURRENCY);
