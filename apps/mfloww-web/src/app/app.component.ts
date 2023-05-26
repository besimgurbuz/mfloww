import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { MflowwDbService } from '@mfloww/db';
import { TranslateService } from '@ngx-translate/core';
import { filter, mergeMap, Observable, Subject, takeUntil, tap } from 'rxjs';
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
  readonly progressState = inject(ProgressState);
  readonly dbService = inject(MflowwDbService);
  readonly inProgress$ = inject(ProgressState).inProgress$;
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly authService = inject(AuthService);
  readonly titleService = inject(Title);
  readonly translateService = inject(TranslateService);
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
    this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof RouteConfigLoadStart || e instanceof RouteConfigLoadEnd
        ),
        tap((e) => {
          this.progressState.emit(e instanceof RouteConfigLoadStart);
        }),
        takeUntil(this._destroy)
      )
      .subscribe();
    this.dbService.openDb('MFLOWW_DB', [
      { name: 'entries', options: { keyPath: ['monthYear', 'userId'] } },
    ]);
    if (!this.authService.hasSessionExpired()) {
      this.authService
        .getProfileInfo$()
        .pipe(takeUntil(this._destroy))
        .subscribe({
          error: (err: HttpErrorResponse) => this.messenger.emitFromError(err),
        });
    }
    // this.titleService.setTitle(this.translateService.instant('App.MainTitle'));
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
