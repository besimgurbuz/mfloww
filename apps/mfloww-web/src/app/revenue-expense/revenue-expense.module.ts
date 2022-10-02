import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MflowwSelectModule } from '@mfloww/view';
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
    MflowwSelectModule,
  ],
})
export class RevenueExpenseModule {}
