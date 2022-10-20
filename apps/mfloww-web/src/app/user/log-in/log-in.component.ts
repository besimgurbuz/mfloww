import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, mergeMap, Subscription, tap } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ErrorMessengerService } from '../../core/error-messenger.service';
import { ProfileInfo } from '../../core/models/profile-info';
import { UserService } from '../services/user.service';

@Component({
  selector: 'mfloww-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent implements OnInit, OnDestroy {
  logInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  private _logInSubs?: Subscription;
  private _redirectionMessageSubs?: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private errorMessenger: ErrorMessengerService
  ) {}

  ngOnInit(): void {
    this._redirectionMessageSubs = this.route.queryParamMap
      .pipe(
        filter(
          (queryMap) =>
            !!queryMap.get('triedUnauth') || !!queryMap.get('expiredToken')
        ),
        map((queryMap) => {
          const reason =
            queryMap.get('triedUnauth') === 'true'
              ? 'triedUnauth'
              : 'expiredToken';
          return {
            triedUnauth: 'You must be logged in',
            expiredToken: 'Your session has expired. Please log in again',
          }[reason];
        })
      )
      .subscribe((message) => {
        this.errorMessenger.emitMessage('warn', message);
      });
  }

  ngOnDestroy(): void {
    this._logInSubs?.unsubscribe();
    this._redirectionMessageSubs?.unsubscribe();
  }

  submitForm(): void {
    if (this.logInForm.valid) {
      this._logInSubs = this.userService
        .login(this.logInForm.value)
        .pipe(
          filter((response) => response.ok),
          mergeMap(() =>
            this.userService.getProfileInfo().pipe(
              filter((profileInfoRes) => profileInfoRes.ok),
              tap((profileInfo) =>
                this.authService.storeProfileInfo(
                  profileInfo.body as ProfileInfo
                )
              )
            )
          )
        )
        .subscribe(() => {
          this.router.navigate(['/revenue-expense']);
        });
    }
  }
}
