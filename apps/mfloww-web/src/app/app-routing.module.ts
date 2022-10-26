import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from './core/auth.service';
import { NotFoundComponent } from './core/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./landing/landing.module').then((module) => module.LandingModule),
    pathMatch: 'full',
    canActivate: [
      () => {
        const isLoggedIn = inject(AuthService).isUserLoggedIn();
        const router = inject(Router);

        if (isLoggedIn) {
          router.navigate(['/revenue-expense']);
        }

        return !isLoggedIn;
      },
    ],
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
    canActivate: [
      () => {
        const authService = inject(AuthService);
        const isLoggedIn = authService.isUserLoggedIn();
        const router = inject(Router);
        const reason = authService.isTokenExpired()
          ? 'expiredToken'
          : 'triedUnauth';

        if (!isLoggedIn) {
          router.navigate(['/user/log-in'], {
            queryParams: { reason },
          });
        }
        return isLoggedIn;
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
