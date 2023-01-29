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
import { MflowwDbService } from '@mfloww/db';
import { mergeMap, Subscription } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { LATEST_MONTH_YEAR_KEY } from '../../core/core.constants';
import { LocalStorageService } from '../../core/local-storage.service';
import { MessengerService } from '../../core/messenger.service';
import { ProfileInfo } from '../../core/models/profile-info';
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
  readonly passwordGroup = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmNewPassword: new FormControl('', [Validators.required]),
  });

  private profileSubs?: Subscription;
  private deleteDbSubs?: Subscription;

  _profileInfo: ProfileInfo | null = null;

  ngOnInit() {
    this.profileSubs = this.profileInfo$.subscribe((profileInfo) => {
      this._profileInfo = profileInfo;
      const { username, email, key } = profileInfo as ProfileInfo;
      this.profileGroup.get('username')?.setValue(username);
      this.profileGroup.get('email')?.setValue(email);
      this.profileGroup.get('key')?.setValue(key);
    });
  }

  ngOnDestroy(): void {
    this.profileSubs?.unsubscribe();
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
}
