import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { Observable, Subscription } from 'rxjs';
import { RevenueExpenseRecord } from '../models/entry';
import { RevenueExpenseFacade } from './data-access/revenue-expense.facade';

@Component({
  selector: 'mfloww-revenue-expense',
  templateUrl: './revenue-expense.component.html',
  styleUrls: ['./revenue-expense.component.scss'],
})
export class RevenueExpenseComponent implements OnInit, OnDestroy {
  private readonly revenueExpenseFacade = inject(RevenueExpenseFacade);
  entryDates$: Observable<string[]> = this.revenueExpenseFacade.entryDates$;
  revenues$: Observable<RevenueExpenseRecord[]> =
    this.revenueExpenseFacade.selectedRevenues$;
  expenses$: Observable<RevenueExpenseRecord[]> =
    this.revenueExpenseFacade.selectedExpenses$;

  loadEntryListSubs?: Subscription;
  _selectedMonthYear?: string;

  ngOnInit(): void {
    this.loadEntryListSubs = this.revenueExpenseFacade.loadEntryList();
  }

  ngOnDestroy(): void {
    this.loadEntryListSubs?.unsubscribe();
  }

  handleMonthYearChange(month_year: string) {
    this._selectedMonthYear = month_year;
    this.revenueExpenseFacade.setSelectedEntryByMonthYear(month_year);
  }

  handleEntryCreation(
    newEntry: RevenueExpenseRecord,
    type: RevenueExpenseRecordType = 'revenue'
  ) {
    this.revenueExpenseFacade.insertNewRevenueExpenseRecord(newEntry, type);
  }
}
