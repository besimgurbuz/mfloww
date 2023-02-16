import { inject, Injectable } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { map, Observable, Subscription, tap } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { MonthYearEntry, RevenueExpenseRecord } from '../../models/entry';
import { RevenueExpenseDataService } from './revenue-expense-data.service';
import { RevenueExpenseState } from './revenue-expense.state';

@Injectable()
export class RevenueExpenseFacade {
  private readonly authService = inject(AuthService);
  private readonly revenueExpenseDataService = inject(
    RevenueExpenseDataService
  );
  private readonly revenueExpenseState = inject(RevenueExpenseState);

  loadEntryList(): Subscription {
    return this.revenueExpenseDataService
      .getEntryList$(this.userId)
      .pipe(
        tap((entryList) =>
          this.revenueExpenseState.setEntryList(entryList || [])
        )
      )
      .subscribe();
  }

  setSelectedEntryByMonthYear(monthYear: string): void {
    this.revenueExpenseState.setSelectedMonth(monthYear);
  }

  insertNewMonthYearEntry(monthYear: string) {
    return this.revenueExpenseDataService
      .inserNewEntry$([monthYear, this.userId])
      .pipe(
        tap((addedKey: [string, string]) =>
          this.revenueExpenseState.addNewEmptyEntry(addedKey)
        )
      );
  }

  insertNewRevenueExpenseRecord(
    record: RevenueExpenseRecord,
    type: RevenueExpenseRecordType
  ) {
    return this.revenueExpenseDataService
      .insertNewRevenueExpenseRecord$(
        [this.revenueExpenseState.selectedMonthYear, this.userId],
        record,
        type
      )
      .pipe(
        tap(() =>
          this.revenueExpenseState.addRevenueExpenseRecord(record, type)
        )
      );
  }

  deleteRevenueExpenseRecord(index: number, type: RevenueExpenseRecordType) {
    return this.revenueExpenseDataService
      .deleteRevenueExpenseRecord$(
        [this.revenueExpenseState.selectedMonthYear, this.userId],
        type,
        index
      )
      .pipe(
        tap(() =>
          this.revenueExpenseState.deleteRevenueExpenseRecord(index, type)
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

  get currentEntryDates(): string[] {
    return this.revenueExpenseState.currentEntryDates;
  }

  private get userId(): string {
    return this.authService.currentProfileInfo?.id as string;
  }
}
