import { Injectable } from '@angular/core';
import { Entry } from '../../models/entry';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  sumOfEntries(entries: Entry[]): number {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  }

  sumOfTotal(revenues: Entry[], expenses: Entry[]): number {
    return this.sumOfEntries(revenues) + this.sumOfEntries(expenses);
  }
}
