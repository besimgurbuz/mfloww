import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { ProfileInfo } from './models/profile-info';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private profileInfoSubject: Subject<ProfileInfo> = new Subject();

  constructor(private localStorageService: LocalStorageService) {}

  isUserLoggedIn(): boolean | Observable<boolean> {
    return (
      new Date().getTime() <
      this.localStorageService.getNumber(environment.tokenExpKey)
    );
  }

  isTokenExpired(): boolean {
    return !!this.localStorageService.get(environment.tokenExpKey);
  }

  storeProfileInfo(profileInfo: ProfileInfo): void {
    this.profileInfoSubject.next(profileInfo);
  }

  get profileInfo$(): Observable<ProfileInfo> {
    return this.profileInfoSubject.asObservable();
  }
}
