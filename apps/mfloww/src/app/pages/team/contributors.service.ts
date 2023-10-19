import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Contributor } from '../../../types/contributor';

@Injectable()
export class ContributorsService {
  private _contributorsLoading = new BehaviorSubject<boolean>(false);
  private _contributorsError = new BehaviorSubject<
    string | Record<string, unknown>
  >('');
  http = inject(HttpClient);

  fetchContributors$(): Observable<Contributor[]> {
    this._contributorsLoading.next(true);
    return this.http
      .get<Contributor[]>(`${import.meta.env['VITE_API_URL']}/contributors`)
      .pipe(
        tap(() => this._contributorsLoading.next(false)),
        catchError((err) => {
          this._contributorsLoading.next(false);
          this._contributorsError.next(err);
          return of([]);
        })
      );
  }

  get contributorsLoading$(): Observable<boolean> {
    return this._contributorsLoading.asObservable();
  }

  get contributorsError$(): Observable<string | Record<string, unknown>> {
    return this._contributorsError.asObservable();
  }
}
