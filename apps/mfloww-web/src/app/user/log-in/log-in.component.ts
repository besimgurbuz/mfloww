import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, mergeMap, Subscription } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'mfloww-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent implements OnDestroy {
  logInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  private _logInSubs?: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this._logInSubs?.unsubscribe();
  }

  submitForm(): void {
    if (this.logInForm.valid) {
      this._logInSubs = this.userService
        .login(this.logInForm.value)
        .pipe(
          filter((response) => response.ok),
          mergeMap(() => this.authService.getProfileInfo$())
        )
        .subscribe(() => {
          this.router.navigate(['/revenue-expense']);
        });
    }
  }
}
