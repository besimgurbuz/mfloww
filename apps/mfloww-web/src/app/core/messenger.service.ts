import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';

export interface Message {
  type: 'warn' | 'fatal' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  private readonly errorMessageSubject: ReplaySubject<Message> =
    new ReplaySubject<Message>();
  private redirectionMessageSet: Record<string, Message> = {
    triedUnauth: { type: 'warn', message: 'You must be logged in' },
    expiredToken: {
      type: 'warn',
      message: 'Your session has expired. Please log in again',
    },
    newAccount: {
      type: 'info',
      message: 'You can now log-in with your new account',
    },
  };

  emitMessage(type: Message['type'], message: string) {
    this.errorMessageSubject.next({
      type,
      message,
    });
  }

  emitReason(queryMap: ParamMap) {
    const message = this.getActiveMessage(queryMap);

    if (message) {
      this.errorMessageSubject.next({
        message: message.message,
        type: message.type,
      });
    }
  }

  clearMessage(): void {
    this.errorMessageSubject.next({ type: 'info', message: '' });
  }

  getActiveMessage(queryMap: ParamMap): Message | undefined {
    const reason = queryMap.get('reason');
    if (!reason) {
      return undefined;
    }
    return this.redirectionMessageSet[reason];
  }

  get error$(): Observable<Message | null> {
    return this.errorMessageSubject.asObservable();
  }

  get messages(): Record<string, Message> {
    return this.redirectionMessageSet;
  }
}
