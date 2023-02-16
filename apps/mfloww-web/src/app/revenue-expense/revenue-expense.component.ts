import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { MonthYearSelection } from '@mfloww/view';
import { map, Observable, Subscription, tap } from 'rxjs';
import { LATEST_MONTH_YEAR_KEY } from '../core/core.constants';
import { LocalStorageService } from '../core/local-storage.service';
import { RevenueExpenseRecord } from '../models/entry';
import { RevenueExpenseFacade } from './data-access/revenue-expense.facade';
import { CalculatorService } from './services/calculator.service';

@Component({
  selector: 'mfloww-revenue-expense',
  templateUrl: './revenue-expense.component.html',
  styleUrls: ['./revenue-expense.component.scss'],
})
export class RevenueExpenseComponent implements OnInit, OnDestroy {
  private readonly revenueExpenseFacade = inject(RevenueExpenseFacade);
  private readonly calculatorService = inject(CalculatorService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly localStorageService = inject(LocalStorageService);

  entryDates$: Observable<string[]> =
    this.revenueExpenseFacade.entryDates$.pipe(
      tap(() => this.setInitialMonthYear())
    );
  hasEntry$: Observable<boolean> = this.revenueExpenseFacade.entryList$.pipe(
    map((entries) => entries && entries.length > 0)
  );
  revenues$: Observable<RevenueExpenseRecord[]> =
    this.revenueExpenseFacade.selectedRevenues$;
  expenses$: Observable<RevenueExpenseRecord[]> =
    this.revenueExpenseFacade.selectedExpenses$;
  totalRevenue$: Observable<number> = this.calculatorService.totalRevenue$;
  totalExpense$: Observable<number> = this.calculatorService.totalExpense$;
  overallTotal$: Observable<number> = this.calculatorService.overallTotal$;

  monthSelectionControl = new FormControl<string>('');

  loadEntryListSubs?: Subscription;
  monthSelectionChangeSubs?: Subscription;

  ngOnInit(): void {
    this.loadEntryListSubs = this.revenueExpenseFacade.loadEntryList();
    this.setInitialMonthYear();
    this.monthSelectionChangeSubs =
      this.monthSelectionControl.valueChanges.subscribe((monthYear) => {
        if (monthYear) {
          this.revenueExpenseFacade.setSelectedEntryByMonthYear(monthYear);
          this.cd.detectChanges();
          this.localStorageService.set(LATEST_MONTH_YEAR_KEY, monthYear);
        }
      });
  }

  ngOnDestroy(): void {
    this.loadEntryListSubs?.unsubscribe();
    this.monthSelectionChangeSubs?.unsubscribe();
  }

  handleEntryCreation({ month, year }: MonthYearSelection) {
    const monthYear = `${month}_${year}`;
    this.revenueExpenseFacade.insertNewMonthYearEntry(monthYear).subscribe();
    this.monthSelectionControl.setValue(monthYear);
  }

  handleRecordCreation(
    newEntry: RevenueExpenseRecord,
    type: RevenueExpenseRecordType = 'revenue'
  ) {
    this.revenueExpenseFacade
      .insertNewRevenueExpenseRecord(newEntry, type)
      .subscribe();
  }

  handleRecordDeletion(
    index: number,
    type: RevenueExpenseRecordType = 'revenue'
  ) {
    this.revenueExpenseFacade
      .deleteRevenueExpenseRecord(index, type)
      .subscribe();
  }

  private setInitialMonthYear(): void {
    const latestMonthYear = this.localStorageService.get<string>(
      LATEST_MONTH_YEAR_KEY
    );

    if (
      latestMonthYear &&
      this.revenueExpenseFacade.currentEntryDates.includes(latestMonthYear)
    ) {
      this.monthSelectionControl.setValue(latestMonthYear);
      this.revenueExpenseFacade.setSelectedEntryByMonthYear(latestMonthYear);
    } else {
      this.monthSelectionControl.setValue('');
    }
  }
}
