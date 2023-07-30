import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { catchError, map, of } from 'rxjs';
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
        const authService = inject(AuthService);
        const router = inject(Router);

        if (authService.hasSessionExpired()) {
          return true;
        }

        return authService.getProfileInfo$().pipe(
          map((response) => {
            if (response.ok) {
              router.navigate(['/balance']);
            }
            return !response.ok;
          }),
          catchError(() => of(true))
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
    path: 'balance',
    loadChildren: () =>
      import('./balance/balance.module').then((module) => module.BalanceModule),
    canActivate: [
      () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (authService.currentProfileInfo !== null) {
          return true;
        }

        return authService.getProfileInfo$().pipe(
          map((response) => {
            if (!response.ok) {
              const reason = authService.isTokenExpired()
                ? 'expiredToken'
                : 'triedUnauth';
              router.navigate(['/user/sign-in'], {
                queryParams: { reason },
              });
            }
            return response.ok;
          }),
          catchError(() => {
            const reason = authService.isTokenExpired()
              ? 'expiredToken'
              : 'triedUnauth';
            router.navigate(['/user/sign-in'], {
              queryParams: { reason },
            });
            return of(false);
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
  { path: 'graph', loadChildren: () => import('./graph/graph.module').then(m => m.GraphModule) },
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
