import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, mergeMap, Subscription } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { Message, MessengerService } from '../../core/messenger.service';
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
    private messenger: MessengerService
  ) {}

  ngOnInit(): void {
    this.handleLogInRedirectInfo();
    this._redirectionMessageSubs = this.route.queryParamMap
      .pipe(
        map(this.messenger.getActiveMessage),
        filter((key) => !!key)
      )
      .subscribe((key) => this.handleLogInRedirectInfo(key));
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
          mergeMap(() => this.authService.getProfileInfo())
        )
        .subscribe(() => {
          this.router.navigate(['/revenue-expense']);
        });
    }
  }

  private handleLogInRedirectInfo(message?: Message) {
    if (message) {
      this.messenger.emitMessage(
        message.type as Message['type'],
        message.message
      );
    }
  }
}
