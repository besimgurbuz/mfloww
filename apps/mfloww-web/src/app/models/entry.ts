import { SupportedCurrency } from '@mfloww/common';

export interface Entry {
  amount: number;
  currency: SupportedCurrency;
  label: string;
}
