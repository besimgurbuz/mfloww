import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BalanceRecordType } from '@mfloww/common';
import { map, Observable, Subscription, tap } from 'rxjs';
import { AuthService } from '../../../core/auth.service';
import { BalanceRecord, MonthYearEntry } from '../models/entry';
import { DashboardDataService } from '../services/dashboard-data.service';
import { DashboardState } from '../states/dashboard.state';

@Injectable()
export class DashbaordFacade {
  private readonly authService = inject(AuthService);
  private readonly balanceDataService = inject(DashboardDataService);
  private readonly dasboardState = inject(DashboardState);

  loadEntryList(destroyRef: DestroyRef): Subscription {
    return this.balanceDataService
      .getEntryList$(this.userId)
      .pipe(
        tap((entryList) => this.dasboardState.setEntryList(entryList || [])),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe();
  }

  setSelectedEntryByMonthYear(monthYear: string): void {
    this.dasboardState.setSelectedMonth(monthYear);
  }

  insertNewMonthYearEntry$(monthYear: string) {
    return this.balanceDataService
      .inserNewEntry$([monthYear, this.userId])
      .pipe(
        tap((addedKey: [string, string]) =>
          this.dasboardState.addNewEmptyEntry(addedKey)
        )
      );
  }

  deleteMonthYearEntry$(monthYear: string) {
    return this.balanceDataService
      .deleteEntry$([monthYear, this.userId])
      .pipe(
        tap(() => this.dasboardState.removeEntry([monthYear, this.userId]))
      );
  }

  insertNewBalanceRecord(record: BalanceRecord, type: BalanceRecordType) {
    return this.balanceDataService
      .insertNewBalanceRecord$(
        [this.dasboardState.selectedMonthYear, this.userId],
        record,
        type
      )
      .pipe(tap(() => this.dasboardState.addBalanceRecord(record, type)));
  }

  deleteBalanceRecord(index: number, type: BalanceRecordType) {
    return this.balanceDataService
      .deleteBalanceRecord$(
        [this.dasboardState.selectedMonthYear, this.userId],
        type,
        index
      )
      .pipe(tap(() => this.dasboardState.deleteBalanceRecord(index, type)));
  }

  get entryDates$(): Observable<string[]> {
    return this.dasboardState.entryDates$.pipe(
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
    return this.dasboardState.entryList$;
  }

  get selectedMonthYear$(): Observable<string> {
    return this.dasboardState.selectedMonthYear$;
  }

  get selectedEntry$(): Observable<MonthYearEntry | null> {
    return this.dasboardState.selectedEntry$;
  }

  get selectedRevenues$(): Observable<BalanceRecord[]> {
    return this.dasboardState.selectedRevenues$;
  }

  get selectedExpenses$(): Observable<BalanceRecord[]> {
    return this.dasboardState.selectedExpenses$;
  }

  get currentEntryDates(): string[] {
    return this.dasboardState.currentEntryDates.sort((dateA, dateB) => {
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
