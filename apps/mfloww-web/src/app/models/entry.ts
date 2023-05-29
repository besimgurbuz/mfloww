import { SupportedCurrencyCode } from '@mfloww/common';

export interface RevenueExpenseRecord {
  amount: number;
  currency: SupportedCurrencyCode;
  label: string;
}

export interface MonthYearEntry {
  userId: string;
  monthYear: string;
  revenues: RevenueExpenseRecord[];
  expenses: RevenueExpenseRecord[];
}
