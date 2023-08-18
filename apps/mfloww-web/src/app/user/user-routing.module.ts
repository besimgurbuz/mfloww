import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { PlatformRedirectComponent } from './platform-redirect/platform-redirect.component';
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
          router.navigate(['/dashboard/balance']);
        }
        return !isLoggedIn;
      },
    ],
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [
      () => {
        const isLoggedIn = inject(AuthService).isUserLoggedIn();
        const router = inject(Router);

        if (isLoggedIn) {
          router.navigate(['/dashboard/balance']);
        }
        return !isLoggedIn;
      },
    ],
  },
  {
    path: 'platform-redirect',
    component: PlatformRedirectComponent,
    canActivate: [
      () => {
        const isLoggedIn = inject(AuthService).isUserLoggedIn();
        const router = inject(Router);

        if (isLoggedIn) {
          router.navigate(['/dashboard/balance']);
        }
        return !isLoggedIn;
      },
    ],
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
          authService.logOut$().subscribe();
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
