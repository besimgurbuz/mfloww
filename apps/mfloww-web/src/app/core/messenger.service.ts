import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';

export interface Message {
  type: 'warn' | 'fatal' | 'info';
  text: string;
  disappearDuration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  private readonly errorMessageSubject: ReplaySubject<Message> =
    new ReplaySubject<Message>();

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((queryParamMap) => {
      this.emitFromQueryParamMap(queryParamMap);
    });
  }

  private redirectionMessageSet: Record<string | number, Message> = {
    triedUnauth: {
      type: 'fatal',
      text: "Oops, it look like you haven't logged in yet. Please log in.",
    },
    expiredToken: {
      type: 'fatal',
      text: 'Oops, it look like your session has expired. Please log in again.',
    },
    newAccount: {
      type: 'info',
      text: 'Welcome! You can now log in with your new account',
    },
  };

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
        text: 'Opps, looks like your session has expired. Please log-in again.',
      },
    };

    return messages[failResponse.status];
  }
}
