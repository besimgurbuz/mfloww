import { Injectable } from '@angular/core';
import { Entry } from '../../models/entry';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  sumOfEntries(entries: Entry[]): number {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  }
}
