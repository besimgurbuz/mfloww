import { Injectable } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MonthYearEntry, RevenueExpenseRecord } from '../../models/entry';

@Injectable()
export class RevenueExpenseState {
  private readonly entryListSubject: BehaviorSubject<MonthYearEntry[]> =
    new BehaviorSubject<MonthYearEntry[]>([]);
  private readonly selectedMonthSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  setEntryList(entryList: MonthYearEntry[]): void {
    this.entryListSubject.next(entryList);
  }

  addNewEntry(entry: MonthYearEntry): void {
    const currentList = this.entryListSubject.value;
    currentList.push(entry);
    this.entryListSubject.next(currentList);
  }

  removeEntry([entryMonthYear, entryUserId]: [string, string]): void {
    const currentList = this.entryListSubject.value;
    const filteredEntryList = currentList.filter(({ userId, monthYear }) => {
      return !(userId === entryUserId && monthYear === entryMonthYear);
    });
    this.entryListSubject.next(filteredEntryList);
  }

  addNewEmptyEntry(key: [string, string]): void {
    const [monthYear, userId] = key;
    this.addNewEntry({
      userId,
      monthYear,
      expenses: [],
      revenues: [],
    });
  }

  addRevenueExpenseRecord(
    record: RevenueExpenseRecord,
    type: RevenueExpenseRecordType
  ): void {
    const currentEntryMonthYear = this.selectedMonthSubject.value;
    const entryIndex = this.entryListSubject.value.findIndex(
      (entry) => entry.monthYear === currentEntryMonthYear
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

  deleteRevenueExpenseRecord(
    index: number,
    type: RevenueExpenseRecordType
  ): void {
    const currentEntryMonthYear = this.selectedMonthSubject.value;
    const entryProp: `${RevenueExpenseRecordType}s` =
      type === 'revenue' ? 'revenues' : 'expenses';

    const entryIndex = this.entryListSubject.value.findIndex(
      ({ monthYear: month_year }) => month_year === currentEntryMonthYear
    );

    if (entryIndex >= 0) {
      const updatedList = [...this.entryListSubject.value];
      const updatedCurrentEntry = updatedList[entryIndex];
      updatedCurrentEntry[entryProp].splice(index, 1);

      this.entryListSubject.next(updatedList);
    }
  }

  setSelectedMonth(monthYear: string): void {
    this.selectedMonthSubject.next(monthYear);
  }

  get entryDates$(): Observable<string[]> {
    return this.entryList$.pipe(
      map((entryList) => entryList.map((entry) => entry.monthYear))
    );
  }

  get entryList$(): Observable<MonthYearEntry[]> {
    return this.entryListSubject.asObservable();
  }

  get selectedMonthYear$(): Observable<string> {
    return this.selectedMonthSubject.asObservable();
  }

  get selectedEntry$(): Observable<MonthYearEntry | null> {
    return combineLatest([this.entryList$, this.selectedMonthYear$]).pipe(
      map(
        ([entryList, selectedMonth]) =>
          entryList.find((entry) => entry.monthYear === selectedMonth) || null
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

  get currentEntryDates(): string[] {
    return this.entryListSubject.value.map((entry) => entry.monthYear);
  }
}
