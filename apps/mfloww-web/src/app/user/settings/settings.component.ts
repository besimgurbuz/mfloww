import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ProfileInfo } from '../../core/models/profile-info';

@Component({
  selector: 'mfloww-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {
  readonly profileGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [Validators.required]),
    key: new FormControl({ value: '', disabled: true }),
  });
  private readonly profileInfo$ = inject(AuthService).profileInfo$;
  private profileSubs?: Subscription;

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
  }

  isFormValueDifferent() {
    return (
      this.profileGroup.value.email !== this._profileInfo?.email ||
      this.profileGroup.value.username !== this._profileInfo?.username
    );
  }
}
