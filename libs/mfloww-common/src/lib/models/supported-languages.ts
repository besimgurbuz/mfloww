export const SUPPORTED_LANGUAGES = {
  en: '🇺🇸',
  de: '🇩🇪',
  es: '🇪🇸',
  fr: '🇫🇷',
  kr: '🇰🇷',
  ru: '🇷🇺',
  tr: '🇹🇷',
  uk: '🇺🇦',
  'zh-cn': '🇨🇳',
};

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const SUPPORTED_LANGUAGE_KEYS = Object.keys(SUPPORTED_LANGUAGES);
export const SUPPORTED_LANGUAGE_LABELS = Object.values(SUPPORTED_LANGUAGES);

export function convertLocaleToSupportedLanguage(
  locale: string
): SupportedLanguage {
  const [lang] = locale.split('-');

  if (SUPPORTED_LANGUAGE_KEYS.includes(lang)) return lang as SupportedLanguage;
  return locale as SupportedLanguage;
}
