import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorMessage {
  type: 'warn' | 'fatal';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorMessengerService {
  private readonly errorMessageSubject: BehaviorSubject<ErrorMessage | null> =
    new BehaviorSubject<ErrorMessage | null>(null);

  emitMessage(type: ErrorMessage['type'], message: string) {
    this.errorMessageSubject.next({
      type,
      message,
    });
  }

  clearMessage(): void {
    this.errorMessageSubject.next(null);
  }

  get error$(): Observable<ErrorMessage | null> {
    return this.errorMessageSubject.asObservable();
  }
}
