import { Injectable, WritableSignal, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActiveUrlService {
  private activeUrlSubject: Subject<string> = new Subject();
  private _activeUrl: WritableSignal<string> = signal<string>('');

  emitActiveUrl(url: string) {
    this._activeUrl.set(url);
    this.activeUrlSubject.next(url);
  }

  activeUrl$() {
    return this.activeUrlSubject.asObservable();
  }

  activeUrl() {
    return this._activeUrl;
  }
}
