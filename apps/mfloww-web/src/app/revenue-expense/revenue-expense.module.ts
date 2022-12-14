import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MflowwEntryInputModule,
  MflowwMonthYearPickerComponent,
  MflowwSelectModule,
} from '@mfloww/view';
import { SharedModule } from '../shared/shared.module';
import { MoneyTableEntryComponent } from './components/money-table-entry/money-table-entry.component';
import { MoneyTableComponent } from './components/money-table/money-table.component';
import { OverallTableComponent } from './components/overall-panel/overall-panel.component';
import { RevenueExpenseDataService } from './data-access/revenue-expense-data.service';
import { RevenueExpenseFacade } from './data-access/revenue-expense.facade';
import { RevenueExpenseState } from './data-access/revenue-expense.state';
import { EntryDatePipe } from './pipes/entry-date/entry-date.pipe';
import { RevenueExpenseComponent } from './revenue-expense.component';
import { CalculatorService } from './services/calculator.service';
import { CurrencyService } from './services/currency.service';

@NgModule({
  declarations: [
    RevenueExpenseComponent,
    MoneyTableComponent,
    MoneyTableEntryComponent,
    OverallTableComponent,
    EntryDatePipe,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: RevenueExpenseComponent,
      },
    ]),
    ReactiveFormsModule,
    MflowwEntryInputModule,
    MflowwSelectModule,
    MflowwMonthYearPickerComponent,
  ],
  providers: [
    RevenueExpenseDataService,
    RevenueExpenseState,
    RevenueExpenseFacade,
    CalculatorService,
    CurrencyService,
  ],
})
export class RevenueExpenseModule {}
