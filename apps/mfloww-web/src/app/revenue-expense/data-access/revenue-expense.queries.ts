import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Entry } from '../../models/entry';
import { RevenueExpenseEntryService } from './revenue-expense-entry.service';

export function queryRevenueExpense(): [
  Observable<string[] | undefined>,
  (month_year: string) => Observable<Entry[]>,
  (month_year: string) => Observable<Entry[]>
] {
  const entries$ = inject(RevenueExpenseEntryService).entries$();
  const entryDates$ = entries$.pipe(
    map((entries) => entries?.map((entry) => entry.month_year))
  );
  const selectedEntryRevenues$ = (month_year: string) =>
    entries$.pipe(
      map(
        (entries) =>
          entries?.find((entry) => entry.month_year === month_year)?.revenues ||
          []
      )
    );
  const selectedEntryExpenses$ = (month_year: string) =>
    entries$.pipe(
      map(
        (entries) =>
          entries?.find((entry) => entry.month_year === month_year)?.expenses ||
          []
      )
    );

  return [entryDates$, selectedEntryRevenues$, selectedEntryExpenses$];
}
