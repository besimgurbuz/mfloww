import { inject, Injectable } from '@angular/core';
import { EntryType } from '@mfloww/common';
import { MflowwDbService } from '@mfloww/db';
import { mergeMap, Observable } from 'rxjs';
import { Entry, MonthYearEntry } from '../../models/entry';

@Injectable({
  providedIn: 'root',
})
export class RevenueExpenseEntryService {
  private readonly dbService = inject(MflowwDbService);

  entries$(): Observable<MonthYearEntry[] | undefined> {
    return this.dbService.getAll<MonthYearEntry[]>('entries');
  }

  insertNewEntry(month_year: string, entry: Entry, entryType: EntryType) {
    const currentEntry$ = this.dbService.get<MonthYearEntry>(
      'entries',
      month_year
    );

    return currentEntry$.pipe(
      mergeMap((currentEntry) => {
        if (currentEntry) {
          const updateList =
            entryType === 'revenue'
              ? currentEntry.revenues
              : currentEntry.expenses;
          updateList.push(entry);
        }
        return this.dbService.insert<MonthYearEntry>('entries', {
          month_year,
          expenses: currentEntry?.expenses || [],
          revenues: currentEntry?.revenues || [],
        });
      })
    );
  }
}
