import { RouteMeta } from '@analogjs/router';
import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupportedPlatform } from '@mfloww/common';
import { MflowwInputComponent } from '@mfloww/view';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { injectTrpcClient } from '../../../trpc-client';
import { PlatformButtonComponent } from '../../components/platform-button/platform-button.component';
import { AuthService } from '../../core/auth.service';
import { UserInfo } from '../../core/models/profile-info';
import { shouldDisplayWhenLoggedOut } from '../../core/route-guards';

export const routeMeta: RouteMeta = {
  title: () =>
    `${inject(TranslocoService).translate('Common.SignIn')} | mfloww`,
  canActivate: [shouldDisplayWhenLoggedOut],
};

@Component({
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    MflowwInputComponent,
    PlatformButtonComponent,
    TranslocoDirective,
    ReactiveFormsModule,
  ],
  template: `
    <div
      class="w-full h-full lg:px-28 md:px-18 px-6 pt-32 pb-[236px] flex flex-col gap-[75px] md:gap-[150px]"
      *transloco="let t"
    >
      <main
        class="flex flex-col items-center justify-start flex-grow gap-[1.5rem]"
      >
        <div class="flex flex-col gap-4 items-center text-center">
          <h1 class="text-3xl md:text-5xl text-mfloww_success">
            {{ t('Common.SignIn') }}
          </h1>
        </div>
        <div class="providers">
          <ng-container *ngFor="let platform of platforms">
            <mfloww-platform-button
              [platform]="platform"
            ></mfloww-platform-button>
          </ng-container>
        </div>
        <span class="text-sm">{{ t('Common.Or') }}</span>
        <button
          class="border-solid border-2 rounded border-mfloww_white px-10 py-2 hover:bg-mfloww_white hover:text-mfloww_bg text-sm"
          (click)="loginAnonymously()"
        >
          {{ t('Common.ContinueAnonymously') }}
        </button>
      </main>
    </div>
  `,
})
export default class SignInComponent {
  private trpClient = injectTrpcClient();
  private authService = inject(AuthService);
  private router = inject(Router);

  platforms: SupportedPlatform[] = Object.values(SupportedPlatform);

  loginAnonymously() {
    this.trpClient.auth.loginAnonymously.mutate().subscribe((anonymousUser) => {
      this.authService.setProfileInfo(anonymousUser as UserInfo);
      this.router.navigate(['/dashboard/balance']);
    });
  }
}
