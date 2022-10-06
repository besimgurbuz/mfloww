import { Component } from '@angular/core';
import { EntryType, SupportedCurrency } from '@mfloww/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Entry } from '../models/entry';
import { CalculatorService } from './services/calculator.service';

@Component({
  selector: 'mfloww-revenue-expense',
  templateUrl: './revenue-expense.component.html',
  styleUrls: ['./revenue-expense.component.scss'],
})
export class RevenueExpenseComponent {
  revenueEntriesSubject: BehaviorSubject<Entry[]> = new BehaviorSubject<
    Entry[]
  >([
    { label: 'Salary', amount: 10000, currency: SupportedCurrency.USD },
    { label: 'Rent', amount: 1000, currency: SupportedCurrency.USD },
    { label: 'Others', amount: 500, currency: SupportedCurrency.USD },
  ]);
  expenseEntriesSubject: BehaviorSubject<Entry[]> = new BehaviorSubject<
    Entry[]
  >([
    { label: 'Credit Card', amount: -5000, currency: SupportedCurrency.USD },
    { label: 'Hobby', amount: -1000, currency: SupportedCurrency.USD },
    { label: 'Subscriptions', amount: -100, currency: SupportedCurrency.EUR },
  ]);
  totalRevenue$ = this.revenueEntriesSubject.pipe(
    map(this.calculatorService.sumOfEntries)
  );
  totalExpense$ = this.expenseEntriesSubject.pipe(
    map(this.calculatorService.sumOfEntries)
  );
  overallTotal$ = combineLatest([
    this.revenueEntriesSubject,
    this.expenseEntriesSubject,
  ]).pipe(
    map(([revenues, expenses]) =>
      this.calculatorService.sumOfTotal(revenues, expenses)
    )
  );

  constructor(private calculatorService: CalculatorService) {}

  handleMonthSelection(selection: string) {
    console.log(selection);
  }

  handleEntryCreation(newEntry: Entry, type: EntryType = 'revenue') {
    if (type === 'revenue') {
      this.revenueEntriesSubject.next(
        this.revenueEntriesSubject.value.concat(newEntry)
      );
    } else {
      this.expenseEntriesSubject.next(
        this.expenseEntriesSubject.value.concat(newEntry)
      );
    }
  }

  get revenueEntries$() {
    return this.revenueEntriesSubject.asObservable();
  }

  get expenseEntries$() {
    return this.expenseEntriesSubject.asObservable();
  }
}
