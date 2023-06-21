import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { map, tap } from 'rxjs';
import { AuthService } from './core/auth.service';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
    canActivate: [
      () => {
        const isLoggedIn$ = inject(AuthService).isUserLoggedIn$();
        const router = inject(Router);

        return isLoggedIn$.pipe(
          map((userLoggedIn) => {
            if (userLoggedIn) {
              router.navigate(['/revenue-expense']);
            }

            return !userLoggedIn;
          })
        );
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
        const isLoggedIn$ = authService.isUserLoggedIn$();
        const router = inject(Router);
        const reason = authService.isTokenExpired()
          ? 'expiredToken'
          : 'triedUnauth';

        return isLoggedIn$.pipe(
          tap((userloggedIn) => {
            if (!userloggedIn) {
              router.navigate(['/user/sign-in'], {
                queryParams: { reason },
              });
            }
          })
        );
      },
    ],
  },
  {
    path: 'team',
    loadChildren: () => import('./team/team.module').then((m) => m.TeamModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'changelog',
    loadChildren: () =>
      import('./changelog/changelog.module').then((m) => m.ChangelogModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
