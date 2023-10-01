import { inject, Injectable } from '@angular/core';
import { BalanceRecordType } from '@mfloww/common';
import { MflowwDbService } from '@mfloww/db';
import { catchError, EMPTY, map, mergeMap, Observable, of } from 'rxjs';
import { BalanceRecord, MonthYearEntry } from '../models/entry';

@Injectable()
export class DashboardDataService {
  private readonly dbService = inject(MflowwDbService);

  getEntryList$(userId: string): Observable<MonthYearEntry[] | undefined> {
    return this.dbService.getAll<MonthYearEntry>('entries').pipe(
      map(
        (entries) =>
          entries.filter(
            (entry) => entry && entry.userId === userId
          ) as MonthYearEntry[]
      ),
      catchError((err) => {
        console.log(`error while parsing the entry list ${err}`);
        return of([]);
      })
    );
  }

  inserNewEntry$(
    monthAndUserIdKey: [string, string]
  ): Observable<[string, string]> {
    if (!monthAndUserIdKey[0]) {
      const today = new Date();
      monthAndUserIdKey[0] = `${today.getMonth()}_${today.getFullYear()}`;
    }

    return this.dbService.insert<MonthYearEntry, [string, string]>('entries', {
      userId: monthAndUserIdKey[1],
      monthYear: monthAndUserIdKey[0],
      expenses: [],
      revenues: [],
    });
  }

  deleteEntry$(monthAndUserIdKey: [string, string]): Observable<void> {
    return this.dbService.delete('entries', monthAndUserIdKey);
  }

  insertNewBalanceRecord$(
    monthAndUserIdKey: [string, string],
    record: BalanceRecord,
    recordType: BalanceRecordType
  ) {
    const currentEntry$ = this.dbService.get<MonthYearEntry>(
      'entries',
      monthAndUserIdKey
    );

    return currentEntry$.pipe(
      mergeMap((currentEntry) => {
        if (currentEntry) {
          const updateList =
            recordType === 'revenue'
              ? currentEntry.revenues
              : currentEntry.expenses;
          updateList.push(record);
        }
        return this.dbService.update<MonthYearEntry>('entries', {
          userId: monthAndUserIdKey[1],
          monthYear: monthAndUserIdKey[0],
          expenses: currentEntry?.expenses || [],
          revenues: currentEntry?.revenues || [],
        });
      })
    );
  }

  updateBalanceRecord$(
    monthAndUserIdKey: [string, string],
    newRecord: BalanceRecord,
    recordType: BalanceRecordType,
    index: number
  ) {
    const currentEntry$ = this.dbService.get<MonthYearEntry>(
      'entries',
      monthAndUserIdKey
    );

    return currentEntry$.pipe(
      mergeMap((currentEntry) => {
        if (!currentEntry) return EMPTY;
        currentEntry[recordType === 'expense' ? 'expenses' : 'revenues'][
          index
        ] = newRecord;
        return this.dbService.update<MonthYearEntry>('entries', {
          userId: monthAndUserIdKey[1],
          monthYear: monthAndUserIdKey[0],
          expenses: currentEntry.expenses,
          revenues: currentEntry.revenues,
        });
      })
    );
  }

  deleteBalanceRecord$(
    monthAndUserIdKey: [string, string],
    recordType: BalanceRecordType,
    index: number
  ) {
    const currentEntry$ = this.dbService.get<MonthYearEntry>(
      'entries',
      monthAndUserIdKey
    );

    return currentEntry$.pipe(
      mergeMap((currentEntry) => {
        if (!currentEntry) return EMPTY;

        currentEntry[recordType === 'expense' ? 'expenses' : 'revenues'].splice(
          index,
          1
        );
        return this.dbService.update<MonthYearEntry>('entries', {
          userId: monthAndUserIdKey[1],
          monthYear: monthAndUserIdKey[0],
          expenses: currentEntry.expenses,
          revenues: currentEntry.revenues,
        });
      })
    );
  }
}
