import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, mergeMap } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { MessengerService } from '../../core/messenger.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'mfloww-platform-redirect',
  templateUrl: './platform-redirect.component.html',
  styleUrls: ['./platform-redirect.component.scss'],
})
export class PlatformRedirectComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly messenger = inject(MessengerService);

  platform?: string;
  inProgress?: boolean;

  ngOnInit(): void {
    const routeParamsMap = this.route.snapshot.queryParamMap;
    const email = routeParamsMap.get('email');
    const accessToken = routeParamsMap.get('accessToken');
    this.platform = routeParamsMap.get('platform') || undefined;

    if (email && accessToken) {
      this.inProgress = true;
      this.userService
        .signInWithPlatform(email, accessToken)
        .pipe(
          filter((response) => response.ok),
          mergeMap(() => this.authService.getProfileInfo$())
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/balance']);
          },
          error: (err: HttpErrorResponse) => {
            const message =
              err.status === 401
                ? 'The user platform secret is incorrect'
                : 'An error occured while trying to login. Please try again.';
            this.messenger.emitMessage({
              text: message,
              type: 'fatal',
            });
          },
        });
    } else {
      this.router.navigate(['/']);
    }
  }
}
