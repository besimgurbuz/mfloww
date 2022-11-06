import { inject, Injectable } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { Observable, Subscription, tap } from 'rxjs';
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
        tap((entryList) => {
          const entryMonthYearList =
            entryList?.map((entry) => entry.month_year) || [];

          this.revenueExpenseState.setEntryDates(entryMonthYearList);
          this.revenueExpenseState.setEntryList(entryList || []);
        })
      )
      .subscribe();
  }

  setSelectedEntryByMonthYear(month_year: string): void {
    this.revenueExpenseState.setSelectedMonth(month_year);
  }

  insertNewMonthYearEntry(month_year?: string) {
    return this.revenueExpenseDataService.inserNewEntry$(month_year).subscribe;
  }

  insertNewRevenueExpenseRecord(
    record: RevenueExpenseRecord,
    type: RevenueExpenseRecordType
  ): Subscription {
    return this.revenueExpenseDataService
      .insertNewRevenueExpenseRecord$(
        this.revenueExpenseState.selectedMonthYear,
        record,
        type
      )
      .subscribe(() =>
        this.revenueExpenseState.addRevenueExpenseRecord(record, type)
      );
  }

  get entryDates$(): Observable<string[]> {
    return this.revenueExpenseState.entryDates$;
  }

  get entryList$(): Observable<MonthYearEntry[]> {
    return this.revenueExpenseState.entryList$;
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
