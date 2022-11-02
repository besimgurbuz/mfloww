import { SupportedCurrency } from '@mfloww/common';

export interface RevenueExpenseRecord {
  amount: number;
  currency: SupportedCurrency;
  label: string;
}

export interface MonthYearEntry {
  month_year: string;
  revenues: RevenueExpenseRecord[];
  expenses: RevenueExpenseRecord[];
}
