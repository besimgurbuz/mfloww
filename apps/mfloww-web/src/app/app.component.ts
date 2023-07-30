import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationEnd,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import {
  convertLocaleToSupportedLanguage,
  SupportedLanguage,
} from '@mfloww/common';
import { MflowwDbService } from '@mfloww/db';
import { TranslateService } from '@ngx-translate/core';
import { filter, mergeMap, Observable, Subject, takeUntil, tap } from 'rxjs';
import { ActiveUrlService } from './core/active-url.service';
import { AuthService } from './core/auth.service';
import { LocalStorageService } from './core/local-storage.service';
import { Message, MessengerService } from './core/messenger.service';
import { ProfileInfo } from './core/models/profile-info';
import { ProgressState } from './core/progress.state';

@Component({
  selector: 'mfloww-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private messenger = inject(MessengerService);
  private progressState = inject(ProgressState);
  private dbService = inject(MflowwDbService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private translateService = inject(TranslateService);
  private localStorage = inject(LocalStorageService);
  private activeUrlService = inject(ActiveUrlService);

  _profileInfo$: Observable<ProfileInfo | null> = this.authService.profileInfo$;
  inProgress$ = inject(ProgressState).inProgress$;
  _shouldDisplayFooter = true;
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
  _initialLanguage?: SupportedLanguage | null;
  private _destroy: Subject<void> = new Subject();

  ngOnInit(): void {
    this.router.events
      .pipe(
        tap((e) => {
          if (e instanceof NavigationEnd) {
            this.handleFooterDisplay();
            this.activeUrlService.emitActiveUrl(e.url);
          }
        }),
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
    this.handleInitialLanguage();
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  handleLogOut() {
    this.authService.logOut$().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  closeMessenger() {
    this.messenger.clearMessage();
  }

  handleFooterDisplay() {
    const currentUrl = this.router.url;

    this._shouldDisplayFooter = ['balance', 'graph', 'settings'].includes(
      currentUrl
    );
  }

  handleLanguageChange(lang: SupportedLanguage) {
    this.translateService.use(lang);
    this.localStorage.set('LANG', lang);
  }

  private handleInitialLanguage() {
    const browserLanguage: SupportedLanguage = convertLocaleToSupportedLanguage(
      window.navigator?.language || 'en-US'
    );
    this._initialLanguage =
      this.localStorage.get<SupportedLanguage>('LANG') || browserLanguage;

    this.translateService.use(this._initialLanguage);
  }
}
