import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CryptoSecretService } from '@mfloww/db';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { ProfileInfo } from './models/profile-info';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly cryptoSecretService = inject(CryptoSecretService);

  private profileInfoPath = '/api/user/profile';
  private logOutPath = '/api/auth/logout';
  private profileInfoSubject: BehaviorSubject<ProfileInfo | null> =
    new BehaviorSubject<ProfileInfo | null>(null);

  hasSessionExpired(): boolean {
    const expiresInMs = this.localStorageService.getNumber(
      environment.tokenExpKey
    );

    if (expiresInMs === null) return true;

    return new Date().getTime() > expiresInMs;
  }

  isUserLoggedIn(): boolean {
    return !this.hasSessionExpired() && this.profileInfoSubject.value !== null;
  }

  isUserLoggedIn$(): Observable<boolean> {
    return this.profileInfoSubject.pipe(
      map((profileInfo) => !this.hasSessionExpired() && !!profileInfo)
    );
  }

  isTokenExpired(): boolean {
    return !!this.localStorageService.get(environment.tokenExpKey);
  }

  getProfileInfo$(): Observable<HttpResponse<ProfileInfo>> {
    return this.http
      .get<ProfileInfo>(`${environment.apiUrl}${this.profileInfoPath}`, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        tap((profileInfoRes) => {
          if (profileInfoRes.ok) {
            this.profileInfoSubject.next(profileInfoRes.body as ProfileInfo);
            this.cryptoSecretService.secret = profileInfoRes.body
              ?.key as string;
          }
        })
      );
  }

  logOut$(): Observable<HttpResponse<{ message: string }>> {
    return this.http
      .post<{ message: string }>(
        `${environment.apiUrl}${this.logOutPath}`,
        null,
        {
          observe: 'response',
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          this.clearUserCredentials();
        })
      );
  }

  get profileInfo$(): Observable<ProfileInfo | null> {
    return this.profileInfoSubject.asObservable();
  }

  get currentProfileInfo(): ProfileInfo | null {
    return this.profileInfoSubject.value;
  }

  get currentEncryptionKey(): string | undefined {
    return this.currentProfileInfo?.key;
  }

  private clearUserCredentials(): void {
    this.localStorageService.remove(environment.tokenExpKey);
    this.profileInfoSubject.next(null);
    this.cryptoSecretService.secret = '';
  }
}
