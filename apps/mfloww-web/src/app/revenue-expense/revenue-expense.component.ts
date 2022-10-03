import { Component } from '@angular/core';
import { SupportedCurrency } from '../models/currency';
import { Entry } from '../models/entry';

@Component({
  selector: 'mfloww-revenue-expense',
  templateUrl: './revenue-expense.component.html',
  styleUrls: ['./revenue-expense.component.scss'],
})
export class RevenueExpenseComponent {
  revenueEntries: Entry[] = [
    { label: 'Salary', amount: 10000, currency: SupportedCurrency.USD },
    { label: 'Rent', amount: 1000, currency: SupportedCurrency.USD },
    { label: 'Others', amount: 500, currency: SupportedCurrency.USD },
  ];
  expenseEntries: Entry[] = [
    { label: 'Credit Card', amount: 5000, currency: SupportedCurrency.USD },
    { label: 'Hobby', amount: 1000, currency: SupportedCurrency.USD },
    { label: 'Subscriptions', amount: 100, currency: SupportedCurrency.EUR },
  ];

  handleMonthSelection(selection: string) {
    console.log(selection);
  }
}
