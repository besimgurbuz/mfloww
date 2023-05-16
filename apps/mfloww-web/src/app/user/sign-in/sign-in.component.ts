import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupportedPlatform } from '@mfloww/common';
import { Subscription, filter, mergeMap } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { MessengerService } from '../../core/messenger.service';
import { SUPPORTED_PLATFORMS } from '../constants';
import { UserService } from '../services/user.service';

@Component({
  selector: 'mfloww-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnDestroy {
  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  platforms: SupportedPlatform[] = SUPPORTED_PLATFORMS;
  private _logInSubs?: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messenger: MessengerService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this._logInSubs?.unsubscribe();
  }

  submitForm(): void {
    if (this.signInForm.valid) {
      this._logInSubs = this.userService
        .signIn(this.signInForm.value)
        .pipe(
          filter((response) => response.ok),
          mergeMap(() => this.authService.getProfileInfo$())
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/revenue-expense']);
          },
          error: (err: HttpErrorResponse) => {
            const message =
              err.status === 401
                ? 'The credentials you entered are incorrect.'
                : 'An error occured while trying to login. Please try again.';
            this.messenger.emitMessage({
              text: message,
              type: 'fatal',
            });
          },
        });
    }
  }
}
