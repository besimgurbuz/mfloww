import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
  Router,
} from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { TRPCClientError } from '@trpc/client';
import { Observable, ReplaySubject, filter } from 'rxjs';

export interface Message {
  type: 'warn' | 'fatal' | 'info';
  text: string;
  data?: Record<string, string>;
  disappearDuration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private _destroyRef = inject(DestroyRef);
  private translateService = inject(TranslocoService);
  private readonly errorMessageSubject: ReplaySubject<Message> =
    new ReplaySubject<Message>();
  private redirectionMessageSet: Record<string | number, Message> = {
    triedUnauth: {
      type: 'fatal',
      text: 'Errors.triedUnauth',
    },
    expiredToken: {
      type: 'fatal',
      text: 'Errors.expiredToken',
    },
    newAccount: {
      type: 'info',
      text: 'Errors.newAccount',
    },
    updatedProfile: {
      type: 'info',
      text: 'Errors.updatedProfile',
    },
    updatedPassword: {
      type: 'info',
      text: 'Errors.updatedPassword',
    },
    accountDeletion: {
      type: 'info',
      text: 'Errors.accountDeletion',
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
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((queryParamMap) => {
        this.emitFromQueryParamMap(queryParamMap);
      });
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

  emitFromTRPCClientError(trpcError: TRPCClientError<any>) {
    let message!: string;
    let snackBarData: Record<string, string> = {};
    try {
      const { message: parsedMessage, ...data } = JSON.parse(trpcError.message);
      message = parsedMessage;
      snackBarData = data;
    } catch (err) {
      message = trpcError.message;
      snackBarData = trpcError.data;
    }

    if (snackBarData['name']) {
      snackBarData['name'] = this.translateService.translate(
        `FormFields.${snackBarData['name']}`
      );
    }

    this.errorMessageSubject.next({
      type: 'fatal',
      text: message,
      data: snackBarData,
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
