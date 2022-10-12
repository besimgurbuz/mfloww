import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'mfloww-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  _inProgress = false;
  signUpForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
      Validators.pattern('[a-zA-Z_.]+'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(40),
    ]),
  });

  constructor(private userService: UserService) {}

  handleFormSubmit(): void {
    if (this.signUpForm.invalid) return;
    this._inProgress = true;
    this.userService
      .createUser(this.signUpForm.value)
      .pipe(tap(() => (this._inProgress = false)))
      .subscribe();
  }
}
