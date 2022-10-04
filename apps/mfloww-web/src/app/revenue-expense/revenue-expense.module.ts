import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MflowwIconComponent, MflowwSelectModule } from '@mfloww/view';
import { MoneyTableEntryComponent } from './components/money-table-entry/money-table-entry.component';
import { MoneyTableComponent } from './components/money-table/money-table.component';
import { OverallTableComponent } from './components/overall-panel/overall-panel.component';
import { RevenueExpenseComponent } from './revenue-expense.component';

@NgModule({
  declarations: [
    RevenueExpenseComponent,
    MoneyTableComponent,
    MoneyTableEntryComponent,
    OverallTableComponent,
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
    MflowwIconComponent,
  ],
})
export class RevenueExpenseModule {}
