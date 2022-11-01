import { SupportedCurrency } from '@mfloww/common';

export interface Entry {
  amount: number;
  currency: SupportedCurrency;
  label: string;
}

export interface MonthYearEntry {
  month_year: string;
  revenues: Entry[];
  expenses: Entry[];
}
