import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActiveUrlService {
  private activeUrlSubject: Subject<string> = new Subject();
  private _activeUrl = '';

  emitActiveUrl(url: string) {
    this._activeUrl = url;
    this.activeUrlSubject.next(url);
  }

  activeUrl$() {
    return this.activeUrlSubject.asObservable();
  }

  activeUrl() {
    return this._activeUrl;
  }
}
