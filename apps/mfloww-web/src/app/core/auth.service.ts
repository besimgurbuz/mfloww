import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private localStorageService: LocalStorageService) {}

  isUserLoggedIn(): boolean | Observable<boolean> {
    return (
      new Date().getTime() <
      this.localStorageService.getNumber(environment.tokenExpKey)
    );
  }
}
