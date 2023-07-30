import { inject, Injectable } from '@angular/core';
import { BalanceRecordType } from '@mfloww/common';
import { map, Observable, Subscription, tap } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { BalanceRecord, MonthYearEntry } from '../../models/entry';
import { BalanceDataService } from './balance-data.service';
import { BalanceState } from './balance.state';

@Injectable()
export class BalanceFacade {
  private readonly authService = inject(AuthService);
  private readonly balanceDataService = inject(BalanceDataService);
  private readonly balanceState = inject(BalanceState);

  loadEntryList(): Subscription {
    return this.balanceDataService
      .getEntryList$(this.userId)
      .pipe(tap((entryList) => this.balanceState.setEntryList(entryList || [])))
      .subscribe();
  }

  setSelectedEntryByMonthYear(monthYear: string): void {
    this.balanceState.setSelectedMonth(monthYear);
  }

  insertNewMonthYearEntry$(monthYear: string) {
    return this.balanceDataService
      .inserNewEntry$([monthYear, this.userId])
      .pipe(
        tap((addedKey: [string, string]) =>
          this.balanceState.addNewEmptyEntry(addedKey)
        )
      );
  }

  deleteMonthYearEntry$(monthYear: string) {
    return this.balanceDataService
      .deleteEntry$([monthYear, this.userId])
      .pipe(tap(() => this.balanceState.removeEntry([monthYear, this.userId])));
  }

  insertNewBalanceRecord(record: BalanceRecord, type: BalanceRecordType) {
    return this.balanceDataService
      .insertNewBalanceRecord$(
        [this.balanceState.selectedMonthYear, this.userId],
        record,
        type
      )
      .pipe(tap(() => this.balanceState.addBalanceRecord(record, type)));
  }

  deleteBalanceRecord(index: number, type: BalanceRecordType) {
    return this.balanceDataService
      .deleteBalanceRecord$(
        [this.balanceState.selectedMonthYear, this.userId],
        type,
        index
      )
      .pipe(tap(() => this.balanceState.deleteBalanceRecord(index, type)));
  }

  get entryDates$(): Observable<string[]> {
    return this.balanceState.entryDates$.pipe(
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
    return this.balanceState.entryList$;
  }

  get selectedMonthYear$(): Observable<string> {
    return this.balanceState.selectedMonthYear$;
  }

  get selectedEntry$(): Observable<MonthYearEntry | null> {
    return this.balanceState.selectedEntry$;
  }

  get selectedRevenues$(): Observable<BalanceRecord[]> {
    return this.balanceState.selectedRevenues$;
  }

  get selectedExpenses$(): Observable<BalanceRecord[]> {
    return this.balanceState.selectedExpenses$;
  }

  get currentEntryDates(): string[] {
    return this.balanceState.currentEntryDates.sort((dateA, dateB) => {
      const [monthA, yearA] = dateA.split('_');
      const [monthB, yearB] = dateB.split('_');

      if (yearA === yearB) {
        return Number(monthA) - Number(monthB);
      }
      return Number(yearA) - Number(yearB);
    });
  }

  private get userId(): string {
    return this.authService.currentProfileInfo?.id as string;
  }
}
