export interface CurrencyApiResponse {
  data: Record<string, CurrencyApiCurrentRate>;
}

export interface CurrencyApiCurrentRate {
  code: string;
  value: number;
}
