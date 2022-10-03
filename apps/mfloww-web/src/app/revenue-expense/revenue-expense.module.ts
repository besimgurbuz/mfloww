import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MflowwSelectModule } from '@mfloww/view';
import { MoneyTableComponent } from './components/money-table/money-table.component';
import { RevenueExpenseComponent } from './revenue-expense.component';
import { MoneyTableEntryComponent } from './components/money-table-entry/money-table-entry.component';

@NgModule({
  declarations: [
    RevenueExpenseComponent,
    MoneyTableComponent,
    MoneyTableEntryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RevenueExpenseComponent,
      },
    ]),
    MflowwSelectModule,
  ],
})
export class RevenueExpenseModule {}
