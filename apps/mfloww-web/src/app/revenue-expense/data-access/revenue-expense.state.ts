import { Injectable } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MonthYearEntry, RevenueExpenseRecord } from '../../models/entry';

@Injectable()
export class RevenueExpenseState {
  private readonly entryMonthsSubject: BehaviorSubject<string[]> =
    new BehaviorSubject<string[]>([]);
  private readonly entryListSubject: BehaviorSubject<MonthYearEntry[]> =
    new BehaviorSubject<MonthYearEntry[]>([]);
  private readonly selectedMonthSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  setEntryDates(entryDates: string[]): void {
    this.entryMonthsSubject.next(entryDates);
  }

  setEntryList(entryList: MonthYearEntry[]): void {
    this.entryListSubject.next(entryList);
  }

  addRevenueExpenseRecord(
    record: RevenueExpenseRecord,
    type: RevenueExpenseRecordType
  ): void {
    const currentEntryMonthYear = this.selectedMonthSubject.value;
    const entryIndex = this.entryListSubject.value.findIndex(
      (entry) => entry.month_year === currentEntryMonthYear
    );
    const entryProp: `${RevenueExpenseRecordType}s` =
      type === 'revenue' ? 'revenues' : 'expenses';

    if (entryIndex >= 0) {
      const updatedList = [...this.entryListSubject.value];
      const updatedCurrentEntry = updatedList[entryIndex];
      updatedCurrentEntry[entryProp].push(record);

      this.entryListSubject.next(updatedList);
    }
  }

  setSelectedMonth(month_year: string): void {
    this.selectedMonthSubject.next(month_year);
  }

  get entryDates$(): Observable<string[]> {
    return this.entryMonthsSubject.asObservable();
  }

  get entryList$(): Observable<MonthYearEntry[]> {
    return this.entryListSubject.asObservable();
  }

  get selectedMonth$(): Observable<string> {
    return this.selectedMonthSubject.asObservable();
  }

  get selectedEntry$(): Observable<MonthYearEntry | null> {
    return combineLatest([this.entryList$, this.selectedMonth$]).pipe(
      map(
        ([entryList, selectedMonth]) =>
          entryList.find((entry) => entry.month_year === selectedMonth) || null
      )
    );
  }

  get selectedRevenues$(): Observable<RevenueExpenseRecord[]> {
    return this.selectedEntry$.pipe(map((entry) => entry?.revenues || []));
  }

  get selectedExpenses$(): Observable<RevenueExpenseRecord[]> {
    return this.selectedEntry$.pipe(map((entry) => entry?.expenses || []));
  }

  get selectedMonthYear(): string {
    return this.selectedMonthSubject.value || '';
  }
}
