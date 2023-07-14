import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { ProgressState } from '../core/progress.state';

@Injectable()
export class ProgressTriggererInterceptorService implements HttpInterceptor {
  constructor(private progressState: ProgressState) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.progressState.emitTrue();
    return next.handle(req).pipe(
      finalize(() => {
        this.progressState.emitFalse();
      })
    );
  }
}
