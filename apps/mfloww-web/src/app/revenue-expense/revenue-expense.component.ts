import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { Observable, Subscription } from 'rxjs';
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

  entryDates$: Observable<string[]> = this.revenueExpenseFacade.entryDates$;
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
    this.monthSelectionChangeSubs =
      this.monthSelectionControl.valueChanges.subscribe((month_year) => {
        if (month_year) {
          this.revenueExpenseFacade.setSelectedEntryByMonthYear(month_year);
          this.cd.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.loadEntryListSubs?.unsubscribe();
    this.monthSelectionChangeSubs?.unsubscribe();
  }

  handleEntryCreation(
    newEntry: RevenueExpenseRecord,
    type: RevenueExpenseRecordType = 'revenue'
  ) {
    this.revenueExpenseFacade.insertNewRevenueExpenseRecord(newEntry, type);
  }
}
