import { inject, Injectable } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { MflowwDbService } from '@mfloww/db';
import { EMPTY, mergeMap, Observable } from 'rxjs';
import { MonthYearEntry, RevenueExpenseRecord } from '../../models/entry';

@Injectable()
export class RevenueExpenseDataService {
  private readonly dbService = inject(MflowwDbService);

  getEntryList$(): Observable<MonthYearEntry[] | undefined> {
    return this.dbService.getAll<MonthYearEntry[]>('entries');
  }

  inserNewEntry$(month_year?: string): Observable<MonthYearEntry> {
    if (!month_year) {
      const today = new Date();
      month_year = `${today.getMonth()}_${today.getFullYear()}`;
    }

    return this.dbService.insert<MonthYearEntry>('entries', {
      month_year,
      expenses: [],
      revenues: [],
    });
  }

  deleteEntry$(month_year: string): Observable<void> {
    return this.dbService.delete('entries', month_year);
  }

  insertNewRevenueExpenseRecord$(
    month_year: string,
    record: RevenueExpenseRecord,
    recordType: RevenueExpenseRecordType
  ) {
    const currentEntry$ = this.dbService.get<MonthYearEntry>(
      'entries',
      month_year
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
          month_year,
          expenses: currentEntry?.expenses || [],
          revenues: currentEntry?.revenues || [],
        });
      })
    );
  }

  updateRevenueExpenseRecord$(
    month_year: string,
    newRecord: RevenueExpenseRecord,
    recordType: RevenueExpenseRecordType,
    index: number
  ) {
    const currentEntry$ = this.dbService.get<MonthYearEntry>(
      'entries',
      month_year
    );

    return currentEntry$.pipe(
      mergeMap((currentEntry) => {
        if (!currentEntry) return EMPTY;
        currentEntry[recordType === 'expense' ? 'expenses' : 'revenues'][
          index
        ] = newRecord;
        return this.dbService.update<MonthYearEntry>('entries', {
          month_year,
          expenses: currentEntry.expenses,
          revenues: currentEntry.revenues,
        });
      })
    );
  }

  deleteRevenueExpenseRecord$(
    month_year: string,
    recordType: RevenueExpenseRecordType,
    index: number
  ) {
    const currentEntry$ = this.dbService.get<MonthYearEntry>(
      'entries',
      month_year
    );

    return currentEntry$.pipe(
      mergeMap((currentEntry) => {
        if (!currentEntry) return EMPTY;

        currentEntry[recordType === 'expense' ? 'expenses' : 'revenues'].splice(
          index,
          1
        );
        return this.dbService.update<MonthYearEntry>('entries', {
          month_year,
          expenses: currentEntry.expenses,
          revenues: currentEntry.revenues,
        });
      })
    );
  }
}
