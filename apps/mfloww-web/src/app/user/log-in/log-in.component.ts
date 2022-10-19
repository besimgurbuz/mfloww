import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorMessengerService } from '../../core/error-messenger.service';
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

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private errorMessenger: ErrorMessengerService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('triedUnauth') === 'true') {
      this.errorMessenger.emitMessage(
        'warn',
        'You must be logged in to access'
      );
    }
  }

  ngOnDestroy(): void {
    this._logInSubs?.unsubscribe();
  }

  submitForm(): void {
    if (this.logInForm.valid) {
      this._logInSubs = this.userService
        .login(this.logInForm.value)
        .subscribe((res) => {
          if (res.ok) {
            this.router.navigate(['/revenue-expense']);
          }
        });
    }
  }
}
