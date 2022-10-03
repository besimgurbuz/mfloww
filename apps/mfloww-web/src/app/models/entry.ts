import { SupportedCurrency } from './currency';

export interface Entry {
  amount: number;
  currency: SupportedCurrency;
  label: string;
}
