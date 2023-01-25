import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MflowwDbService } from '@mfloww/db';
import { mergeMap, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from './core/auth.service';
import { Message, MessengerService } from './core/messenger.service';
import { ProfileInfo } from './core/models/profile-info';
import { ProgressState } from './core/progress.state';

@Component({
  selector: 'mfloww-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  readonly messenger = inject(MessengerService);
  readonly dbService = inject(MflowwDbService);
  readonly inProgress$ = inject(ProgressState).inProgress$;
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly authService = inject(AuthService);
  readonly _profileInfo$: Observable<ProfileInfo | null> =
    this.authService.profileInfo$;

  message$ = this.messenger.error$.pipe(
    mergeMap(
      (value) =>
        new Observable<Message | null>((subscriber) => {
          subscriber.next(value);

          if (value?.disappearDuration) {
            setTimeout(() => {
              subscriber.next({ text: '', type: 'info' });
            }, value.disappearDuration);
          }
        })
    )
  );
  private _destroy: Subject<void> = new Subject();

  ngOnInit(): void {
    this.dbService.openDb('MFLOWW_DB', [
      { name: 'entries', options: { keyPath: 'month_year' } },
    ]);
    if (!this.authService.hasSessionExpired()) {
      this.authService
        .getProfileInfo$()
        .pipe(takeUntil(this._destroy))
        .subscribe({
          error: (err: HttpErrorResponse) => this.messenger.emitFromError(err),
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  handleLogOut() {
    this.authService.clearUserCredentials();
    this.router.navigate(['/']);
  }

  closeMessenger() {
    this.messenger.clearMessage();
  }
}
