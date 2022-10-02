import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MflowwSelectComponent } from '@mfloww/view';
import { RevenueExpenseComponent } from './revenue-expense.component';

@NgModule({
  declarations: [RevenueExpenseComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: RevenueExpenseComponent,
      },
    ]),
    MflowwSelectComponent,
  ],
})
export class RevenueExpenseModule {}
