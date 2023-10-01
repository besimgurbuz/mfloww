import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

export const shouldDisplayWhenLoggedIn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isUserLoggedIn$().pipe(
    map((isUserLoggedIn) => {
      if (!isUserLoggedIn) {
        router.navigate(['/sign-in'], {
          queryParams: {
            reason: authService.isTokenExpired()
              ? 'expiredToken'
              : 'triedUnauth',
          },
        });
      }

      return isUserLoggedIn;
    })
  );
};

export const shouldDisplayWhenLoggedOut = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isUserLoggedIn$().pipe(
    map((isUserLoggedIn) => {
      if (isUserLoggedIn) {
        router.navigate(['/dashboard']);
      }

      return !isUserLoggedIn;
    })
  );
};
