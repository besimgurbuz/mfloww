export const SUPPORTED_CURRENCIES = {
  AUD: '🇦🇺',
  BND: '🇧🇳',
  BRL: '🇧🇷',
  CAD: '🇨🇦',
  CHF: '🇨🇭',
  CNY: '🇨🇳',
  CZK: '🇨🇿',
  EGP: '🇪🇬',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  INR: '🇮🇳',
  IRR: '🇮🇷',
  JOD: '🇯🇴',
  JPY: '🇯🇵',
  KRW: '🇰🇷',
  KWD: '🇰🇼',
  LYD: '🇱🇾',
  MXN: '🇲🇽',
  NZD: '🇳🇿',
  OMR: '🇴🇲',
  PHP: '🇵🇭',
  RUB: '🇷🇺',
  SGD: '🇸🇬',
  THB: '🇹🇭',
  TRY: '🇹🇷',
  USD: '🇺🇸',
  UAH: '🇺🇦',
  VND: '🇻🇳',
} as const;

export type SupportedCurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

export const SUPPORTED_CURRENCY_CODES: SupportedCurrencyCode[] = Object.keys(
  SUPPORTED_CURRENCIES
) as SupportedCurrencyCode[];
export const SUPPORTED_CURRENCY_FLAGS = Object.values(SUPPORTED_CURRENCIES);

export function getTargetCurrenciesByBase(
  base: SupportedCurrencyCode
): SupportedCurrencyCode[] {
  const codes = Object.keys(SUPPORTED_CURRENCIES);
  return codes.filter((code) => code !== base) as SupportedCurrencyCode[];
}
