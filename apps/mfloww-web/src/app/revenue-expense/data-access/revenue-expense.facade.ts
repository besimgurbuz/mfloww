import { inject, Injectable } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { map, Observable, Subscription, tap } from 'rxjs';
import { MonthYearEntry, RevenueExpenseRecord } from '../../models/entry';
import { RevenueExpenseDataService } from './revenue-expense-data.service';
import { RevenueExpenseState } from './revenue-expense.state';

@Injectable()
export class RevenueExpenseFacade {
  private readonly revenueExpenseDataService = inject(
    RevenueExpenseDataService
  );
  private readonly revenueExpenseState = inject(RevenueExpenseState);

  loadEntryList(): Subscription {
    return this.revenueExpenseDataService
      .getEntryList$()
      .pipe(
        tap((entryList) =>
          this.revenueExpenseState.setEntryList(entryList || [])
        )
      )
      .subscribe();
  }

  setSelectedEntryByMonthYear(month_year: string): void {
    this.revenueExpenseState.setSelectedMonth(month_year);
  }

  insertNewMonthYearEntry(month_year?: string) {
    return this.revenueExpenseDataService.inserNewEntry$(month_year).pipe(
      tap((addedMonthYear) => {
        this.revenueExpenseState.addNewEmptyEntry(addedMonthYear);
      })
    );
  }

  insertNewRevenueExpenseRecord(
    record: RevenueExpenseRecord,
    type: RevenueExpenseRecordType
  ) {
    return this.revenueExpenseDataService
      .insertNewRevenueExpenseRecord$(
        this.revenueExpenseState.selectedMonthYear,
        record,
        type
      )
      .pipe(
        tap(() =>
          this.revenueExpenseState.addRevenueExpenseRecord(record, type)
        )
      );
  }

  get entryDates$(): Observable<string[]> {
    return this.revenueExpenseState.entryDates$.pipe(
      map((entryDates) =>
        entryDates.sort((dateA, dateB) => {
          const [monthA, yearA] = dateA.split('_');
          const [monthB, yearB] = dateB.split('_');

          if (yearA === yearB) {
            return Number(monthA) - Number(monthB);
          }
          return Number(yearA) - Number(yearB);
        })
      )
    );
  }

  get entryList$(): Observable<MonthYearEntry[]> {
    return this.revenueExpenseState.entryList$;
  }

  get selectedMonthYear$(): Observable<string> {
    return this.revenueExpenseState.selectedMonthYear$;
  }

  get selectedEntry$(): Observable<MonthYearEntry | null> {
    return this.revenueExpenseState.selectedEntry$;
  }

  get selectedRevenues$(): Observable<RevenueExpenseRecord[]> {
    return this.revenueExpenseState.selectedRevenues$;
  }

  get selectedExpenses$(): Observable<RevenueExpenseRecord[]> {
    return this.revenueExpenseState.selectedExpenses$;
  }
}
