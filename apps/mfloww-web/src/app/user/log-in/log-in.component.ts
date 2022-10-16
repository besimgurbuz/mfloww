import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorMessengerService } from '../../core/error-messenger.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'mfloww-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent implements OnInit {
  logInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private userService: UserService,
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

  submitForm(): void {
    this.userService.login(this.logInForm.value).subscribe();
  }
}
