import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
              router.navigate(['/dashboard/balance']);
            }
            return !response.ok;
          }),
          catchError(() => of(true))
        );
      },
    ],
    title: () => {
      return inject(TranslateService).get('App.MainTitle');
    },
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then((module) => module.UserModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then(
        (mod) => mod.DASHBOARD_ROUTES
      ),
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
    title: () => {
      return inject(TranslateService)
        .get('Common.Team')
        .pipe(map((title: string) => `${title} | mfloww`));
    },
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then((m) => m.FaqModule),
    title: () => {
      return inject(TranslateService)
        .get('Common.FAQ')
        .pipe(map((title: string) => `${title} | mfloww`));
    },
  },
  {
    path: 'changelog',
    loadChildren: () =>
      import('./changelog/changelog.module').then((m) => m.ChangelogModule),
    title: () => {
      return inject(TranslateService)
        .get('Common.Changelog')
        .pipe(map((title: string) => `${title} | mfloww`));
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'mfloww  404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
