import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EntryType } from '@mfloww/common';
import { Observable } from 'rxjs';
import { Entry } from '../models/entry';
import { RevenueExpenseEntryService } from './data-access/revenue-expense-entry.service';
import { queryRevenueExpense } from './data-access/revenue-expense.queries';
import { CalculatorService } from './services/calculator.service';

@Component({
  selector: 'mfloww-revenue-expense',
  templateUrl: './revenue-expense.component.html',
  styleUrls: ['./revenue-expense.component.scss'],
})
export class RevenueExpenseComponent {
  private readonly entryService = inject(RevenueExpenseEntryService);
  entryData$ = queryRevenueExpense();
  dateControl: FormControl<string> = new FormControl();

  constructor(private calculatorService: CalculatorService) {}

  handleEntryCreation(newEntry: Entry, type: EntryType = 'revenue') {
    if (this.dateControl.value) {
      this.entryService
        .insertNewEntry(this.dateControl.value, newEntry, type)
        .subscribe();
    }
  }

  get entryDates$(): Observable<string[] | undefined> {
    return this.entryData$[0];
  }

  get selectedRevenues$() {
    return this.entryData$[1](this.dateControl.value || '');
  }

  get selectedExpenses$() {
    return this.entryData$[2](this.dateControl.value || '');
  }
}
