export interface CurrencyLayerResponse {
  quotes: Record<string, number>;
  source: string;
  success: boolean;
  timestamp: number;
}
