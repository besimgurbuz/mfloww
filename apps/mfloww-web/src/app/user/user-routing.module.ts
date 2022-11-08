import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { LogInComponent } from './log-in/log-in.component';
import { SettingsComponent } from './settings/settings.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'log-in',
    pathMatch: 'full',
  },
  {
    path: 'log-in',
    component: LogInComponent,
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
    path: 'sign-up',
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
    component: SignUpComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [
      () => {
        const authService = inject(AuthService);
        const isLoggedIn = authService.isUserLoggedIn();
        const router = inject(Router);

        if (!isLoggedIn) {
          router.navigate(['/user/log-in'], {
            queryParams: { reason: 'expiredToken' },
          });
          authService.clearUserCredentials();
        }
        return isLoggedIn;
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
