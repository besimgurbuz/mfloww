import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
  Router,
} from '@angular/router';
import { Observable, ReplaySubject, Subject, filter, takeUntil } from 'rxjs';

export interface Message {
  type: 'warn' | 'fatal' | 'info';
  text: string;
  disappearDuration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MessengerService implements OnDestroy {
  private readonly errorMessageSubject: ReplaySubject<Message> =
    new ReplaySubject<Message>();
  private _destroy = new Subject<void>();
  private redirectionMessageSet: Record<string | number, Message> = {
    triedUnauth: {
      type: 'fatal',
      text: 'App.Errors.triedUnauth',
    },
    expiredToken: {
      type: 'fatal',
      text: 'App.Errors.expiredToken',
    },
    newAccount: {
      type: 'info',
      text: 'App.Errors.newAccount',
    },
    updatedProfile: {
      type: 'info',
      text: 'App.Errors.updatedProfile',
    },
    updatedPassword: {
      type: 'info',
      text: 'App.Errors.updatedPassword',
    },
    accountDeletion: {
      type: 'info',
      text: 'App.Errors.accountDeletion',
      disappearDuration: 3000,
    },
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationEnd &&
            !this.route.snapshot.queryParamMap.get('reason')
        )
      )
      .subscribe(() => {
        this.errorMessageSubject.next({
          text: '',
          type: 'info',
        });
      });
    this.route.queryParamMap
      .pipe(takeUntil(this._destroy))
      .subscribe((queryParamMap) => {
        this.emitFromQueryParamMap(queryParamMap);
      });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  emitMessage(message: Message) {
    this.errorMessageSubject.next(message);
  }

  emitFromError(
    err: HttpErrorResponse | Record<string, unknown>,
    messageKey?: string
  ) {
    if (err instanceof HttpErrorResponse) {
      this.errorMessageSubject.next(this.getErrorMessageOfHttpFailure(err));
      return;
    }

    this.errorMessageSubject.next({
      type: 'fatal',
      text: err[messageKey || ''] as string,
    });
  }

  emitFromQueryParamMap(paramMap: ParamMap) {
    const message = this.getErrorMessageOfQueryParamMap(paramMap);
    if (message) {
      this.emitMessage(message);
    } else {
      this.clearMessage();
    }
  }

  clearMessage(): void {
    this.errorMessageSubject.next({ type: 'info', text: '' });
  }

  get error$(): Observable<Message | null> {
    return this.errorMessageSubject.asObservable();
  }

  get messages(): Record<string, Message> {
    return this.redirectionMessageSet;
  }

  private getErrorMessageOfQueryParamMap(
    queryMap: ParamMap
  ): Message | undefined {
    const reason = queryMap.get('reason');
    if (!reason) {
      return undefined;
    }
    return this.redirectionMessageSet[reason];
  }

  private getErrorMessageOfHttpFailure(
    failResponse: HttpErrorResponse
  ): Message {
    const messages: Record<number, Message> = {
      401: {
        type: 'fatal',
        text: 'Opps, looks like your session has expired. Please sign-in again.',
      },
      0: {
        type: 'fatal',
        text: 'Server is not responding. Please try again later.',
      },
    };

    return messages[failResponse.status];
  }
}
