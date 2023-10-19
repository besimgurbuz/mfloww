import { RouteMeta } from '@analogjs/router';
import { NgForOf } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupportedPlatform } from '@mfloww/common';
import { MflowwInputComponent } from '@mfloww/view';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { TRPCClientError } from '@trpc/client';
import { injectTrpcClient } from '../../../trpc-client';
import { PlatformButtonComponent } from '../../components/platform-button/platform-button.component';
import { AuthService } from '../../core/auth.service';
import { shouldDisplayWhenLoggedOut } from '../../core/route-guards';
import { SnackBarService } from '../../core/snack-bar.service';

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
      class="w-full h-full lg:px-28 md:px-18 px-6 pt-10 pb-[236px] flex flex-col gap-[75px] md:gap-[150px]"
      *transloco="let t"
    >
      <main
        class="flex flex-col items-center justify-start flex-grow gap-[1.5rem]"
      >
        <div class="flex flex-col gap-4 items-center text-center">
          <h1 class="text-3xl md:text-5xl text-mfloww_success">
            {{ t('Common.SignIn') }}
          </h1>
          <p class="text-xs md:text-sm">
            {{ t('SignIn.DontHaveAccountQuestion') }}
            <a
              routerLink="/sign-up"
              class="text-mfloww_blue whitespace-nowrap"
              >{{ t('Common.SignUp') }}</a
            >
          </p>
        </div>
        <div class="providers">
          <ng-container *ngFor="let platform of platforms">
            <mfloww-platform-button
              [platform]="platform"
            ></mfloww-platform-button>
          </ng-container>
        </div>
        <span class="text-sm">{{ t('Common.Or') }}</span>
        <form
          class="flex flex-col items-center gap-4 w-full max-w-[450px]"
          [formGroup]="signInForm"
          (ngSubmit)="submitForm()"
        >
          <mfloww-view-input
            formControlName="email"
            type="email"
            [placeholder]="t('FormFields.email')"
            autocomplete="email"
            name="Email"
          ></mfloww-view-input>
          <mfloww-view-input
            formControlName="password"
            type="password"
            [placeholder]="t('FormFields.password')"
            name="Password"
            autocomplete="current-password"
          ></mfloww-view-input>
        </form>
      </main>
    </div>
  `,
})
export default class SignInComponent {
  private trpcClient = injectTrpcClient();
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(SnackBarService);
  private _destroyRef = inject(DestroyRef);

  signInForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  platforms: SupportedPlatform[] = Object.values(SupportedPlatform);

  submitForm(): void {
    const { email, password } = this.signInForm.value;
    if (this.signInForm.invalid || !email || !password) return;

    this.trpcClient.auth.login
      .query({
        email,
        password,
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user) => {
          this.authService.setProfileInfo(user);
          this.router.navigate(['/dashboard/balance']);
        },
        error: (error) => {
          if (error instanceof TRPCClientError) {
            this.snackBar.emitFromTRPCClientError(error);
          } else {
            this.snackBar.emitFromError(error);
          }
        },
      });
  }
}
