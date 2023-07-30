import { SupportedCurrencyCode } from '@mfloww/common';

export interface BalanceRecord {
  amount: number;
  currency: SupportedCurrencyCode;
  label: string;
}

export interface MonthYearEntry {
  userId: string;
  monthYear: string;
  revenues: BalanceRecord[];
  expenses: BalanceRecord[];
}
