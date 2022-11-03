import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { RevenueExpenseRecord } from '../../models/entry';
import { RevenueExpenseFacade } from '../data-access/revenue-expense.facade';

@Injectable()
export class CalculatorService {
  private readonly revenueExpenseFacade = inject(RevenueExpenseFacade);

  sumOfEntries(entries: RevenueExpenseRecord[]): number {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  }

  sumOfTotal(
    revenues: RevenueExpenseRecord[],
    expenses: RevenueExpenseRecord[]
  ): number {
    return this.sumOfEntries(revenues) + this.sumOfEntries(expenses);
  }

  get totalRevenue$(): Observable<number> {
    return this.revenueExpenseFacade.selectedRevenues$.pipe(
      map((revenues) =>
        revenues.reduce((total, revenue) => total + revenue.amount, 0)
      )
    );
  }

  get totalExpense$(): Observable<number> {
    return this.revenueExpenseFacade.selectedExpenses$.pipe(
      map((expenses) =>
        expenses.reduce((total, expense) => total + expense.amount, 0)
      )
    );
  }

  get overallTotal$(): Observable<number> {
    return combineLatest([this.totalRevenue$, this.totalExpense$]).pipe(
      map(([totalRevenue, totalExpense]) => totalRevenue + totalExpense)
    );
  }
}
