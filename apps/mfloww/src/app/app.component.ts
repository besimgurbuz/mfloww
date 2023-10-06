import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import {
  SupportedLanguage,
  convertLocaleToSupportedLanguage,
} from '@mfloww/common';
import { MflowwDbService } from '@mfloww/db';
import { MflowwProgressBarComponent } from '@mfloww/view';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { Observable, filter, mergeMap, take, tap } from 'rxjs';
import { injectTrpcClient } from '../trpc-client';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { ActiveUrlService } from './core/active-url.service';
import { AuthService } from './core/auth.service';
import { LocalStorageService } from './core/local-storage.service';
import { ProfileInfo } from './core/models/profile-info';
import { Message, SnackBarService } from './core/snack-bar.service';
import { FadeDirective } from './directives/fade/fade.directive';

@Component({
  selector: 'mfloww-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    NgClass,
    AsyncPipe,
    MflowwProgressBarComponent,
    MenuComponent,
    FooterComponent,
    FadeDirective,
    TranslocoDirective,
  ],
  template: `<div *transloco="let t" class="flex flex-col w-full h-full gap-1">
    <mfloww-view-progress-bar
      class="absolute left-0 right-0 top-0"
      *ngIf="_isInProgress()"
    />
    <mfloww-menu
      [profileInfo]="_profileInfo$ | async"
      (logOutTriggered)="handleLogOut()"
    />
    <main class="mt-16">
      <router-outlet></router-outlet>
    </main>
    <mfloww-footer
      *ngIf="_shouldDisplayFooter"
      [initialLanguage]="_initialLanguage"
      (languageChanged)="handleLanguageChange($event)"
    />
    <ng-container *ngIf="message$ | async as message">
      <div
        *ngIf="message.text"
        mflowwFade="in"
        [mflowwFadeDelay]="100"
        class="fixed bottom-2 md:bottom-10 mx-auto left-0 right-0 min-w-[200px] max-w-[400px] md:max-w-[600px] px-5 py-3 text-xs rounded"
        [ngClass]="{
          'bg-mfloww_warn': message?.type === 'warn',
          'bg-mfloww_fatal': message?.type === 'fatal',
          'bg-mfloww_success': message?.type === 'info'
        }"
        #messageBox
      >
        <div class="flex justify-between items-center">
          <p>{{ t(message!.text, message.data) }}</p>
          <button
            class="text-[10px] hover:opacity-80 rounded border-2 p-1"
            (click)="closeMessenger()"
          >
            {{ t('App.Close') }}
          </button>
        </div>
      </div>
    </ng-container>
  </div>`,
})
export class AppComponent implements OnInit {
  private trpcClient = injectTrpcClient();
  private snackBar = inject(SnackBarService);
  private dbService = inject(MflowwDbService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private localStorage = inject(LocalStorageService);
  private activeUrlService = inject(ActiveUrlService);
  private translateService = inject(TranslocoService);
  private _destroyRef = inject(DestroyRef);

  _profileInfo$: Observable<ProfileInfo | null> = this.authService.profileInfo$;
  _shouldDisplayFooter = true;
  message$ = this.snackBar.error$.pipe(
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
  _isInProgress = signal(false);

  ngOnInit(): void {
    this.router.events
      .pipe(
        tap((e) => {
          if (e instanceof NavigationStart) {
            this._isInProgress.set(true);
          }
          if (e instanceof NavigationEnd) {
            this.scrollToTop();
            this.handleFooterDisplay(e.url);
            this.activeUrlService.emitActiveUrl(e.url);
            this._isInProgress.set(false);
          }
        }),
        filter(
          (e) =>
            e instanceof RouteConfigLoadStart || e instanceof RouteConfigLoadEnd
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
    this.dbService.openDb('MFLOWW_DB', [
      { name: 'entries', options: { keyPath: ['monthYear', 'userId'] } },
    ]);
    this.handleInitialLanguage();
  }

  handleLogOut() {
    this.authService.logOut$().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  closeMessenger() {
    this.snackBar.clearMessage();
  }

  handleFooterDisplay(url: string) {
    url ??= this.router.url;
    this._shouldDisplayFooter = !new RegExp('^(/dashboard|/settings)').test(
      url
    );
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  handleLanguageChange(lang: SupportedLanguage) {
    this.localStorage.set('LANG', lang);
  }

  private handleInitialLanguage() {
    const browserLanguage: SupportedLanguage = convertLocaleToSupportedLanguage(
      window.navigator?.language || 'en-US'
    );
    this._initialLanguage =
      this.localStorage.get<SupportedLanguage>('LANG') || browserLanguage;

    if (this._initialLanguage) {
      this.translateService
        .load(this._initialLanguage)
        .pipe(take(1), takeUntilDestroyed(this._destroyRef))
        .subscribe(() => {
          this.translateService.setActiveLang(
            this._initialLanguage as SupportedLanguage
          );
        });
    }
  }
}
