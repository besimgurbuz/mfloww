import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { ProgressState } from '../core/progress.state';

@Injectable()
export class GeneralInterceptorService implements HttpInterceptor {
  constructor(private progressState: ProgressState) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.progressState.emitTrue();
    return next.handle(req).pipe(
      finalize(() => {
        this.progressState.emitFalse();
      })
    );
  }
}
