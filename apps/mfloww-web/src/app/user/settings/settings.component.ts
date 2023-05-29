import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SUPPORTED_CURRENCIES, SupportedCurrencyCode } from '@mfloww/common';
import { MflowwDbService } from '@mfloww/db';
import { mergeMap, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth.service';
import { LATEST_MONTH_YEAR_KEY } from '../../core/core.constants';
import { LocalStorageService } from '../../core/local-storage.service';
import { MessengerService } from '../../core/messenger.service';
import { ProfileInfo } from '../../core/models/profile-info';
import { PasswordMatchValidator } from '../password-match.validator';
import { UserService } from '../services/user.service';

@Component({
  selector: 'mfloww-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly profileInfo$ = this.authService.profileInfo$;
  private readonly dbService = inject(MflowwDbService);
  private readonly messengerService = inject(MessengerService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

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

  private profileSubs?: Subscription;
  private currencyChangeSubs?: Subscription;
  private deleteDbSubs?: Subscription;

  _profileInfo: ProfileInfo | null = null;

  ngOnInit() {
    this.profileSubs = this.profileInfo$.subscribe((profileInfo) => {
      this._profileInfo = profileInfo;
      const { username, email, key, platform } = profileInfo as ProfileInfo;
      if (platform) {
        this.profileGroup.get('email')?.disable();
      }
      this.profileGroup.get('email')?.setValue(email);
      this.profileGroup.get('username')?.setValue(username);
      this.profileGroup.get('key')?.setValue(key);
    });
    this.handleBaseCurrencySelection();
  }

  ngOnDestroy(): void {
    this.profileSubs?.unsubscribe();
    this.currencyChangeSubs?.unsubscribe();
    this.deleteDbSubs?.unsubscribe();
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
      this.userService
        .updateProfile({
          email: this.profileGroup.value.email as string,
          username: this.profileGroup.value.username as string,
        })
        .pipe(mergeMap(() => this.authService.getProfileInfo$()))
        .subscribe({
          next: (response) => {
            if (response.ok) {
              this.authService.clearUserCredentials();
              this.router.navigate(['/user/sign-in'], {
                queryParams: {
                  reason: 'updatedProfile',
                },
              });
            }
          },
          error: (err: HttpErrorResponse) => {
            this.messengerService.emitFromError(err.error, 'message');
          },
        });
    }
  }

  updatePassword() {
    if (this.passwordGroup.valid) {
      this.userService
        .updatePassword({
          currentPassword: this.passwordGroup.value.currentPassword as string,
          newPassword: this.passwordGroup.value.newPassword as string,
        })
        .pipe(mergeMap(() => this.authService.getProfileInfo$()))
        .subscribe({
          next: (response) => {
            if (response.ok) {
              this.authService.clearUserCredentials();
              this.router.navigate(['/user/sign-in'], {
                queryParams: {
                  reason: 'updatedPassword',
                },
              });
            }
          },
          error: (err: HttpErrorResponse) => {
            this.messengerService.emitFromError(err, 'message');
          },
        });
    }
  }

  handleDeleteLocalDatabase() {
    if (confirm("Are you sure you want to delete this device's database?")) {
      if (this.deleteDbSubs) {
        this.deleteDbSubs.unsubscribe();
      }
      this.deleteDbSubs = this.dbService.clearAllStores().subscribe(() => {
        this.messengerService.emitMessage({
          type: 'info',
          text: 'The database on this device is deleted',
          disappearDuration: 2500,
        });
      });
      this.localStorageService.remove(LATEST_MONTH_YEAR_KEY);
    }
  }

  handleDeleteUser() {
    if (confirm('Are you sure you want to delete this account?')) {
      this.userService.deleteUser().subscribe({
        next: () => {
          this.authService.clearUserCredentials();
          this.router.navigate(['/'], {
            queryParams: { reason: 'accountDeletion' },
          });
        },
        error: () => {
          this.messengerService.emitMessage({
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
    this.currencyChangeSubs = this.baseCurrencyControl.valueChanges.subscribe(
      (selection: SupportedCurrencyCode) =>
        this.localStorageService.set(environment.baseCurrencyKey, selection)
    );
  }
}
