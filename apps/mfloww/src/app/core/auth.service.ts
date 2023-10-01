import { Injectable, inject } from '@angular/core';
import { CryptoSecretService } from '@mfloww/db';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { injectTrpcClient } from '../../trpc-client';
import { LocalStorageService } from './local-storage.service';
import { ProfileInfo } from './models/profile-info';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly trpcClient = injectTrpcClient();
  private readonly localStorageService = inject(LocalStorageService);
  private readonly cryptoSecretService = inject(CryptoSecretService);

  private profileInfoSubject: BehaviorSubject<ProfileInfo | null> =
    new BehaviorSubject<ProfileInfo | null>(null);

  isUserLoggedIn(): boolean {
    return this.profileInfoSubject.value !== null;
  }

  isUserLoggedIn$(): Observable<boolean> {
    return this.profileInfoSubject.pipe(map((profileInfo) => !!profileInfo));
  }

  isTokenExpired(): boolean {
    return !!this.localStorageService.get(environment.tokenExpKey);
  }

  setProfileInfo(profileInfo: ProfileInfo): void {
    this.profileInfoSubject.next(profileInfo);
    this.cryptoSecretService.secret = profileInfo.key;
  }

  logOut$() {
    return this.trpcClient.auth.logout.query().pipe(
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
