import { Injectable, inject } from '@angular/core';
import { CryptoSecretService } from '@mfloww/db';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { injectTrpcClient } from '../../trpc-client';
import { UserInfo } from './models/profile-info';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly trpcClient = injectTrpcClient();
  private readonly cryptoSecretService = inject(CryptoSecretService);

  private profileInfoSubject: BehaviorSubject<UserInfo | null> =
    new BehaviorSubject<UserInfo | null>(null);

  isUserLoggedIn(): boolean {
    return this.profileInfoSubject.value !== null;
  }

  isUserLoggedIn$(): Observable<boolean> {
    return this.profileInfoSubject.pipe(map((profileInfo) => !!profileInfo));
  }

  setProfileInfo(profileInfo: UserInfo): void {
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

  get profileInfo$(): Observable<UserInfo | null> {
    return this.profileInfoSubject.asObservable();
  }

  get currentProfileInfo(): UserInfo | null {
    return this.profileInfoSubject.value;
  }

  get currentEncryptionKey(): string | undefined {
    return this.currentProfileInfo?.key;
  }

  private clearUserCredentials(): void {
    this.profileInfoSubject.next(null);
    this.cryptoSecretService.secret = '';
  }
}
