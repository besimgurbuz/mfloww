import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslateStateService {
  private loadingInProgressSubject: BehaviorSubject<boolean> =
    new BehaviorSubject(true);

  setLoadingState(state: boolean): void {
    this.loadingInProgressSubject.next(state);
  }

  get isLoading$(): Observable<boolean> {
    return this.loadingInProgressSubject.asObservable();
  }
}
