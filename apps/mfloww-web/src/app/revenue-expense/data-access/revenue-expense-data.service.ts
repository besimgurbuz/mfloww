import { inject, Injectable } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { MflowwDbService } from '@mfloww/db';
import { mergeMap, Observable } from 'rxjs';
import { MonthYearEntry, RevenueExpenseRecord } from '../../models/entry';

@Injectable()
export class RevenueExpenseDataService {
  private readonly dbService = inject(MflowwDbService);

  getEntryList$(): Observable<MonthYearEntry[] | undefined> {
    return this.dbService.getAll<MonthYearEntry[]>('entries');
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
}
