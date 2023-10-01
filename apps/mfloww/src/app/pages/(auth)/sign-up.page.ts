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
import { shouldDisplayWhenLoggedOut } from '../../core/route-guards';
import { SnackBarService } from '../../core/snack-bar.service';

export const routeMeta: RouteMeta = {
  title: () =>
    `${inject(TranslocoService).translate('Common.SignUp')} | mfloww`,
  canActivate: [shouldDisplayWhenLoggedOut],
};

@Component({
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    MflowwInputComponent,
    PlatformButtonComponent,
    TranslocoDirective,
    ReactiveFormsModule,
  ],
  template: `
    <div
      *transloco="let t"
      class="w-full h-full lg:px-28 md:px-18 px-6 pt-10 pb-44 flex flex-col gap-[75px] md:gap-[150px]"
    >
      <main
        class="flex flex-col items-center justify-start flex-grow gap-[1.5rem]"
      >
        <div class="flex flex-col gap-4 items-center text-center">
          <h1 class="text-3xl md:text-5xl text-mfloww_success">
            {{ t('Common.SignUp') }}
          </h1>
          <p class="text-xs md:text-sm">
            {{ t('SignUp.HaveAccountQuestion') }}
            <a
              [routerLink]="'/sign-in'"
              class="text-mfloww_blue whitespace-nowrap"
              >{{ t('Common.SignIn') }}</a
            >
          </p>
        </div>
        <div class="providers">
          <ng-container *ngFor="let platform of platforms">
            <mfloww-platform-button
              [platfrom]="platform"
            ></mfloww-platform-button>
          </ng-container>
        </div>
        <span class="text-sm">{{ t('Common.Or') }}</span>
        <form
          class="flex flex-col items-center gap-4 w-full max-w-[450px]"
          [formGroup]="signUpForm"
          (ngSubmit)="submitForm()"
        >
          <mfloww-view-input
            type="text"
            [placeholder]="t('FormFields.username')"
            formControlName="username"
            autocomplete="username"
            name="Username"
          ></mfloww-view-input>
          <mfloww-view-input
            type="email"
            [placeholder]="t('FormFields.email')"
            formControlName="email"
            autocomplete="email"
            name="Email"
          ></mfloww-view-input>
          <mfloww-view-input
            type="password"
            [placeholder]="t('FormFields.password')"
            formControlName="password"
            name="Password"
            autocomplete="new-password"
          ></mfloww-view-input>
          <button
            class="border-solid border-2 rounded border-mfloww_white px-10 py-2 hover:bg-mfloww_white hover:text-mfloww_bg"
            type="submit"
          >
            {{ t('Common.SignUp') }}
          </button>
        </form>
      </main>
    </div>
  `,
})
export default class SignUpComponent {
  private trpcClient = injectTrpcClient();
  private router = inject(Router);
  private _destroyRef = inject(DestroyRef);

  signUpForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z_.0-9]+'),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ],
    }),
  });
  platforms: SupportedPlatform[] = Object.values(SupportedPlatform);
  snackBar = inject(SnackBarService);

  submitForm(): void {
    const { username, email, password } = this.signUpForm.value;
    if (this.signUpForm.invalid || !username || !email || !password) return;

    this.trpcClient.user.create
      .mutate({
        username,
        email,
        password,
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (ok) => {
          if (ok) {
            this.router.navigate(['/sign-in'], {
              queryParams: { reason: 'newAccount' },
            });
          }
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
