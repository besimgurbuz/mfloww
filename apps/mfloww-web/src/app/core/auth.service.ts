import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CryptoSecretService } from '@mfloww/db';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { ProfileInfo } from './models/profile-info';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly cryptoSecretService = inject(CryptoSecretService);

  private profileInfoPath = '/api/user/profile';
  private profileInfoSubject: BehaviorSubject<ProfileInfo | null> =
    new BehaviorSubject<ProfileInfo | null>(null);

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient
  ) {}

  hasSessionExpired(): boolean {
    return (
      new Date().getTime() >
      this.localStorageService.getNumber(environment.tokenExpKey)
    );
  }

  isUserLoggedIn(): boolean | Observable<boolean> {
    return !this.hasSessionExpired() && this.profileInfoSubject.value !== null;
  }

  isTokenExpired(): boolean {
    return !!this.localStorageService.get(environment.tokenExpKey);
  }

  getProfileInfo(): Observable<HttpResponse<ProfileInfo>> {
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

  clearUserCredentials(): void {
    this.localStorageService.remove(environment.tokenExpKey);
    this.profileInfoSubject.next(null);
    this.cryptoSecretService.secret = '';
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
}
