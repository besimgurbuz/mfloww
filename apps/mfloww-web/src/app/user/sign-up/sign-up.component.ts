import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupportedPlatform } from '@mfloww/common';
import { Subscription, tap } from 'rxjs';
import { MessengerService } from '../../core/messenger.service';
import { SUPPORTED_PLATFORMS } from '../constants';
import { UserService } from '../services/user.service';

@Component({
  selector: 'mfloww-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnDestroy {
  _inProgress = false;
  signUpForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
      Validators.pattern('[a-zA-Z_.0-9]+'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(40),
    ]),
  });
  platforms: SupportedPlatform[] = SUPPORTED_PLATFORMS;
  private signUpSubs?: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private messenger: MessengerService
  ) {}

  ngOnDestroy(): void {
    this.signUpSubs?.unsubscribe();
  }

  submitForm(): void {
    if (this.signUpForm.invalid) return;
    this._inProgress = true;
    this.signUpSubs = this.userService
      .signUp(this.signUpForm.value)
      .pipe(tap(() => (this._inProgress = false)))
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.router.navigate(['/user/sign-in'], {
              queryParams: { reason: 'newAccount' },
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.messenger.emitFromError(err.error, 'message');
        },
      });
  }
}
