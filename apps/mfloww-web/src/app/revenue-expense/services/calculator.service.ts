import { Injectable } from '@angular/core';
import { RevenueExpenseRecord } from '../../models/entry';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  sumOfEntries(entries: RevenueExpenseRecord[]): number {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  }

  sumOfTotal(
    revenues: RevenueExpenseRecord[],
    expenses: RevenueExpenseRecord[]
  ): number {
    return this.sumOfEntries(revenues) + this.sumOfEntries(expenses);
  }
}
