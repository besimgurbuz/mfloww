import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./landing/landing.module').then((module) => module.LandingModule),
    pathMatch: 'full',
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then((module) => module.UserModule),
  },
  {
    path: 'revenue-expense',
    loadChildren: () =>
      import('./revenue-expense/revenue-expense.module').then(
        (module) => module.RevenueExpenseModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
