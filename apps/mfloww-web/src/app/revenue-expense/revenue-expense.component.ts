import { Component } from '@angular/core';
import { combineLatest, map, Observable, of } from 'rxjs';
import { SupportedCurrency } from '../models/currency';
import { Entry } from '../models/entry';
import { CalculatorService } from './services/calculator.service';

@Component({
  selector: 'mfloww-revenue-expense',
  templateUrl: './revenue-expense.component.html',
  styleUrls: ['./revenue-expense.component.scss'],
})
export class RevenueExpenseComponent {
  revenueEntries$: Observable<Entry[]> = of([
    { label: 'Salary', amount: 10000, currency: SupportedCurrency.USD },
    { label: 'Rent', amount: 1000, currency: SupportedCurrency.USD },
    { label: 'Others', amount: 500, currency: SupportedCurrency.USD },
  ]);
  expenseEntries$: Observable<Entry[]> = of([
    { label: 'Credit Card', amount: -5000, currency: SupportedCurrency.USD },
    { label: 'Hobby', amount: -1000, currency: SupportedCurrency.USD },
    { label: 'Subscriptions', amount: -100, currency: SupportedCurrency.EUR },
  ]);
  totalRevenue$ = this.revenueEntries$.pipe(
    map(this.calculatorService.sumOfEntries)
  );
  totalExpense$ = this.expenseEntries$.pipe(
    map(this.calculatorService.sumOfEntries)
  );
  overallTotal$ = combineLatest([
    this.revenueEntries$,
    this.expenseEntries$,
  ]).pipe(
    map(([revenues, expenses]) =>
      this.calculatorService.sumOfTotal(revenues, expenses)
    )
  );

  constructor(private calculatorService: CalculatorService) {}

  handleMonthSelection(selection: string) {
    console.log(selection);
  }
}
