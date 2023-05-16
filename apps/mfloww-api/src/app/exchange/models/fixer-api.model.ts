export interface FixerResponse {
  base: string;
  date: Date;
  rates: Record<string, number>;
  success: boolean;
  timestamp: number;
}
