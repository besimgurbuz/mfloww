import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { SettingsComponent } from './settings/settings.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
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
          router.navigate(['/user/sign-in'], {
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
