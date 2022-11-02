import { Injectable } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MonthYearEntry, RevenueExpenseRecord } from '../../models/entry';

@Injectable()
export class RevenueExpenseState {
  private readonly entryDatesSubject: BehaviorSubject<string[]> =
    new BehaviorSubject<string[]>([]);
  private readonly entryListSubject: BehaviorSubject<MonthYearEntry[]> =
    new BehaviorSubject<MonthYearEntry[]>([]);
  private readonly selectedEntrySubject: BehaviorSubject<MonthYearEntry | null> =
    new BehaviorSubject<MonthYearEntry | null>(null);

  setEntryDates(entryDates: string[]): void {
    this.entryDatesSubject.next(entryDates);
  }

  setEntryList(entryList: MonthYearEntry[]): void {
    this.entryListSubject.next(entryList);
  }

  addRevenueExpenseRecord(
    record: RevenueExpenseRecord,
    type: RevenueExpenseRecordType
  ): void {
    const currentEntryMonthYear = this.selectedEntrySubject.value?.month_year;
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
      this.selectedEntrySubject.next(updatedCurrentEntry);
    }
  }

  setSelectedEntryByMonthYear(month_year: string): void {
    const entry = this.entryListSubject.value.find(
      (entry) => entry.month_year === month_year
    );

    if (entry) {
      this.selectedEntrySubject.next(entry);
    }
  }

  setSelectedEntryByIndex(index: number): void {
    const selected = this.entryListSubject.value[index];

    if (selected) {
      this.selectedEntrySubject.next(selected);
    }
  }

  get entryDates$(): Observable<string[]> {
    return this.entryDatesSubject.asObservable();
  }

  get entryList$(): Observable<MonthYearEntry[]> {
    return this.entryListSubject.asObservable();
  }

  get selectedEntry$(): Observable<MonthYearEntry | null> {
    return this.selectedEntrySubject.asObservable();
  }

  get selectedRevenues$(): Observable<RevenueExpenseRecord[]> {
    return this.selectedEntry$.pipe(map((entry) => entry?.revenues || []));
  }

  get selectedExpenses$(): Observable<RevenueExpenseRecord[]> {
    return this.selectedEntry$.pipe(map((entry) => entry?.expenses || []));
  }

  get selectedMonthYear(): string {
    return this.selectedEntrySubject.value?.month_year || '';
  }
}
