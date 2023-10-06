import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Release } from '../../types/release';

@Injectable()
export class GitHubReleaseService {
  private _releasesLoadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private _releasesErrorSubject: BehaviorSubject<
    string | Record<string, unknown>
  > = new BehaviorSubject<string | Record<string, unknown>>('');

  constructor(private http: HttpClient) {}

  loadReleases$(): Observable<Release[]> {
    this._releasesLoadingSubject.next(true);
    return this.http
      .get<Release[]>(`${environment.apiUrl}/api/v1/releases`)
      .pipe(
        tap(() => this._releasesLoadingSubject.next(false)),
        catchError((err) => {
          this._releasesErrorSubject.next(err);
          this._releasesLoadingSubject.next(false);
          return of([]);
        })
      );
  }

  get releasesLoading$(): Observable<boolean> {
    return this._releasesLoadingSubject.asObservable();
  }
}
