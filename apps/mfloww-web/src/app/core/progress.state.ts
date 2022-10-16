import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressState {
  private inProgressSubject: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  emitTrue() {
    this.inProgressSubject.next(true);
  }

  emitFalse() {
    this.inProgressSubject.next(false);
  }

  get inProgress$(): Observable<boolean> {
    return this.inProgressSubject.asObservable();
  }
}
