import { Component } from '@angular/core';

@Component({
  selector: 'mfloww-revenue-expense',
  templateUrl: './revenue-expense.component.html',
  styleUrls: ['./revenue-expense.component.scss'],
})
export class RevenueExpenseComponent {
  handleMonthSelection(selection: string) {
    console.log(selection);
  }
}
