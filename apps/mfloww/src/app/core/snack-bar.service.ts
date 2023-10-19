import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TRPCClientError } from '@trpc/client';
import { Observable, ReplaySubject } from 'rxjs';

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
  private translateService = inject(TranslocoService);
  private readonly errorMessageSubject: ReplaySubject<Message> =
    new ReplaySubject<Message>();

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

  clearMessage(): void {
    this.errorMessageSubject.next({ type: 'info', text: '' });
  }

  get error$(): Observable<Message | null> {
    return this.errorMessageSubject.asObservable();
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
