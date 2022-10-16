import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { ErrorMessengerService } from './core/error-messenger.service';
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

  _messageCleanSubs?: Subscription;

  ngOnInit(): void {
    this._messageCleanSubs = this.router.events
      .pipe(tap(() => this.errorMessenger.clearMessage()))
      .subscribe();
  }

  ngOnDestroy(): void {
    this._messageCleanSubs?.unsubscribe();
  }
}
