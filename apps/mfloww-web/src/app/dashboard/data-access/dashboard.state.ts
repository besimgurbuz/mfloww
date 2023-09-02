import { Injectable } from '@angular/core';
import { BalanceRecordType } from '@mfloww/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { BalanceRecord, MonthYearEntry } from '../../models/entry';

@Injectable()
export class DashboardState {
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

  addBalanceRecord(record: BalanceRecord, type: BalanceRecordType): void {
    const currentEntryMonthYear = this.selectedMonthSubject.value;
    const entryIndex = this.entryListSubject.value.findIndex(
      (entry) => entry.monthYear === currentEntryMonthYear
    );
    const entryProp: `${BalanceRecordType}s` =
      type === 'revenue' ? 'revenues' : 'expenses';

    if (entryIndex >= 0) {
      const updatedList = [...this.entryListSubject.value];
      const updatedCurrentEntry = updatedList[entryIndex];
      updatedCurrentEntry[entryProp].push(record);

      this.entryListSubject.next(updatedList);
    }
  }

  deleteBalanceRecord(index: number, type: BalanceRecordType): void {
    const currentEntryMonthYear = this.selectedMonthSubject.value;
    const entryProp: `${BalanceRecordType}s` =
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

  get selectedRevenues$(): Observable<BalanceRecord[]> {
    return this.selectedEntry$.pipe(map((entry) => entry?.revenues || []));
  }

  get selectedExpenses$(): Observable<BalanceRecord[]> {
    return this.selectedEntry$.pipe(map((entry) => entry?.expenses || []));
  }

  get selectedMonthYear(): string {
    return this.selectedMonthSubject.value || '';
  }

  get currentEntryDates(): string[] {
    return this.entryListSubject.value.map((entry) => entry.monthYear);
  }
}
