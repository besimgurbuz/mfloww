import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './core/auth.service';
import { ErrorMessengerService } from './core/error-messenger.service';
import { ProfileInfo } from './core/models/profile-info';
import { ProgressState } from './core/progress.state';

@Component({
  selector: 'mfloww-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  readonly errorMessenger = inject(ErrorMessengerService);
  readonly errorMessage$ = this.errorMessenger.error$;
  readonly inProgress$ = inject(ProgressState).inProgress$;
  readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly _profileInfo$: Observable<ProfileInfo> =
    this.authService.profileInfo$;

  private _messageCleanSubs?: Subscription;
  private _profileInfoSubs?: Subscription;

  ngOnInit(): void {
    this._messageCleanSubs = this.router.events.subscribe(() =>
      this.errorMessenger.clearMessage()
    );

    if (this.authService.isUserLoggedIn()) {
      this._profileInfoSubs = this.authService.getProfileInfo().subscribe();
    }
  }

  ngOnDestroy(): void {
    this._messageCleanSubs?.unsubscribe();
    this._profileInfoSubs?.unsubscribe();
  }
}
