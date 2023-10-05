import { RouteMeta } from '@analogjs/router';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  SUPPORTED_CURRENCIES,
  SupportedCurrencyCode,
  SupportedLanguage,
} from '@mfloww/common';
import { MflowwDbService } from '@mfloww/db';
import { MflowwInputComponent } from '@mfloww/view';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { mergeMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { injectTrpcClient } from '../../../trpc-client';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';
import { AuthService } from '../../core/auth.service';
import { LATEST_DATE_KEY } from '../../core/core.constants';
import { LocalStorageService } from '../../core/local-storage.service';
import { ProfileInfo } from '../../core/models/profile-info';
import { shouldDisplayWhenLoggedIn } from '../../core/route-guards';
import { SnackBarService } from '../../core/snack-bar.service';

export const routeMeta: RouteMeta = {
  title: () =>
    `${inject(TranslocoService).translate('Common.Settings')} | mfloww`,
  canActivate: [shouldDisplayWhenLoggedIn],
};

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    LanguageSelectorComponent,
    MflowwInputComponent,
    KeyValuePipe,
    TranslocoDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './index.page.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export default class SettingsComponent implements OnInit {
  private trpcClient = injectTrpcClient();
  private dbService = inject(MflowwDbService);
  private localStorageService = inject(LocalStorageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBarService = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);

  readonly profileGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [Validators.required]),
    key: new FormControl({ value: '', disabled: true }),
  });
  readonly passwordGroup = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      confirmNewPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    },
    PasswordMatchValidator('newPassword', 'confirmNewPassword')
  );
  readonly baseCurrencyControl = new FormControl();
  readonly currencyOptions = SUPPORTED_CURRENCIES;

  _profileInfo: ProfileInfo | null = null;
  _initialLanguage?: SupportedLanguage | null;

  ngOnInit() {
    this._initialLanguage = this.localStorageService.get('LANG');
    const { username, email, key, platform } = this.authService
      .currentProfileInfo as ProfileInfo;
    if (platform) {
      this.profileGroup.get('email')?.disable();
    }
    this.profileGroup.get('email')?.setValue(email);
    this.profileGroup.get('username')?.setValue(username);
    this.profileGroup.get('key')?.setValue(key);
    this.handleBaseCurrencySelection();
  }

  isFormValueDifferent(): boolean {
    return (
      this.profileGroup.value.email !== this._profileInfo?.email ||
      this.profileGroup.value.username !== this._profileInfo?.username
    );
  }

  isPasswordFormValid(): boolean {
    return (
      this.passwordGroup.valid &&
      this.passwordGroup.value.currentPassword ===
        this.passwordGroup.value.confirmNewPassword
    );
  }

  updateProfile() {
    if (this.profileGroup.valid && this.isFormValueDifferent()) {
      this.trpcClient.user.update
        .mutate({
          email: this.profileGroup.value.email as string,
          username: this.profileGroup.value.username as string,
        })
        .pipe(mergeMap(() => this.authService.logOut$()))
        .subscribe({
          next: () => {
            this.router.navigate(['/sign-in'], {
              queryParams: {
                reason: 'updatedProfile',
              },
            });
          },
          error: (err) => {
            this.snackBarService.emitFromTRPCClientError(err);
          },
        });
    }
  }

  updatePassword() {
    if (this.passwordGroup.valid) {
      this.trpcClient.user.updatePassword
        .mutate({
          currentPassword: this.passwordGroup.value.currentPassword as string,
          newPassword: this.passwordGroup.value.newPassword as string,
        })
        .pipe(mergeMap(() => this.authService.logOut$()))
        .subscribe({
          next: () => {
            this.router.navigate(['/sign-in'], {
              queryParams: {
                reason: 'updatedPassword',
              },
            });
          },
          error: (err) => {
            this.snackBarService.emitFromTRPCClientError(err);
          },
        });
    }
  }

  handleLanguageChange(lang: SupportedLanguage) {
    this.localStorageService.set('LANG', lang);
  }

  handleDeleteLocalDatabase() {
    if (confirm("Are you sure you want to delete this device's database?")) {
      this.dbService
        .clearAllStores()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.snackBarService.emitMessage({
            type: 'info',
            text: 'The database on this device is deleted',
            disappearDuration: 2500,
          });
        });
      this.localStorageService.remove(LATEST_DATE_KEY);
    }
  }

  handleDeleteUser() {
    if (confirm('Are you sure you want to delete this account?')) {
      this.trpcClient.user.delete
        .mutate()
        .pipe(mergeMap(() => this.authService.logOut$()))
        .subscribe({
          next: () => {
            this.router.navigate(['/'], {
              queryParams: { reason: 'accountDeletion' },
            });
          },
          error: () => {
            this.snackBarService.emitMessage({
              type: 'fatal',
              text: 'Failed to delete your account. Please try again.',
            });
          },
        });
    }
  }

  handleBaseCurrencySelection() {
    const selectedCurrency: SupportedCurrencyCode =
      this.localStorageService.get(environment.baseCurrencyKey) || 'USD';

    this.baseCurrencyControl.setValue(selectedCurrency);
    this.baseCurrencyControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selection: SupportedCurrencyCode) =>
        this.localStorageService.set(environment.baseCurrencyKey, selection)
      );
  }
}

function PasswordMatchValidator(
  passwordControlName: string,
  confirmPasswordControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl) =>
    formGroup.get(passwordControlName)?.value ===
    formGroup.get(confirmPasswordControlName)?.value
      ? null
      : { mismatch: true };
}
