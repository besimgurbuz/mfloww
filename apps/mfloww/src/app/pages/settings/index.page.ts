import { RouteMeta } from '@analogjs/router';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  SUPPORTED_CURRENCIES,
  SupportedCurrencyCode,
  SupportedLanguage,
  SupportedPlatform,
} from '@mfloww/common';
import { MflowwDbService } from '@mfloww/db';
import { MflowwInputComponent } from '@mfloww/view';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { mergeMap } from 'rxjs';
import { injectTrpcClient } from '../../../trpc-client';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';
import { PlatformButtonComponent } from '../../components/platform-button/platform-button.component';
import { AuthService } from '../../core/auth.service';
import { LATEST_DATE_KEY } from '../../core/core.constants';
import { LocalStorageService } from '../../core/local-storage.service';
import { UserInfo } from '../../core/models/profile-info';
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
    PlatformButtonComponent,
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
  readonly baseCurrencyControl = new FormControl();
  readonly currencyOptions = SUPPORTED_CURRENCIES;

  _profileInfo: UserInfo | null = null;
  _initialLanguage?: SupportedLanguage | null;
  _supportedPlatforms: SupportedPlatform[] = Object.values(SupportedPlatform);

  ngOnInit() {
    this._initialLanguage = this.localStorageService.get('LANG');
    this._profileInfo = this.authService.currentProfileInfo as UserInfo;

    if (!this._profileInfo.isAnonymous) {
      this.profileGroup.get('email')?.disable();
      this.profileGroup.get('email')?.setValue(this._profileInfo.email);
      this.profileGroup.get('username')?.setValue(this._profileInfo.username);
    }
    this.profileGroup.get('key')?.setValue(this._profileInfo.key);
    this.handleBaseCurrencySelection();
  }

  updateProfile() {
    if (
      this.profileGroup.valid &&
      !this._profileInfo?.isAnonymous &&
      this.profileGroup.value.username !== this._profileInfo?.username
    ) {
      this.trpcClient.user.update
        .mutate({
          username: this.profileGroup.value.username as string,
        })
        .pipe(mergeMap(() => this.authService.logOut$()))
        .subscribe({
          next: () => {
            this.snackBarService.emitMessage({
              type: 'info',
              text: 'Info.updatedProfile',
              disappearDuration: 3000,
            });
            this.router.navigate(['/sign-in']);
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
            this.snackBarService.emitMessage({
              type: 'info',
              text: 'Info.accountDeletion',
              disappearDuration: 3000,
            });
            this.router.navigate(['/']);
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
      this.localStorageService.get(import.meta.env['VITE_BASE_CURRENCY_KEY']) ||
      'USD';

    this.baseCurrencyControl.setValue(selectedCurrency);
    this.baseCurrencyControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selection: SupportedCurrencyCode) =>
        this.localStorageService.set(
          import.meta.env['VITE_BASE_CURRENCY_KEY'],
          selection
        )
      );
  }
}
