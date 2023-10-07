import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { injectTrpcClient } from '../../trpc-client';
import { AuthService } from './auth.service';

export const shouldDisplayWhenLoggedIn = () => {
  const authService = inject(AuthService);
  const trpcClient = injectTrpcClient();
  const router = inject(Router);

  if (authService.isUserLoggedIn()) {
    return true;
  }

  return trpcClient.auth.hasSession.query().pipe(
    map((profileInfo) => {
      authService.setProfileInfo(profileInfo);
      return true;
    }),
    catchError(() => {
      router.navigate(['/sign-in'], {
        queryParams: {
          reason: 'triedUnauth',
        },
      });
      return of(false);
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
