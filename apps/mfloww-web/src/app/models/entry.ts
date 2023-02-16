import { SupportedCurrency } from '@mfloww/common';

export interface RevenueExpenseRecord {
  amount: number;
  currency: SupportedCurrency;
  label: string;
}

export interface MonthYearEntry {
  userId: string;
  monthYear: string;
  revenues: RevenueExpenseRecord[];
  expenses: RevenueExpenseRecord[];
}
