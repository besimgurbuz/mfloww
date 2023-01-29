import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupportedPlatform } from '@mfloww/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../core/local-storage.service';
import {
  CreateUserPayload,
  CreateUserResult,
  UpdateUserPayload,
  UpdateUserResult,
  UserLoginResult,
} from '../models/user';

@Injectable()
export class UserService {
  private readonly userPath = '/api/user';
  private readonly loginPath = '/api/auth/login';
  private readonly profileInfoPath = '/api/user/profile';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  signUp(
    createUserPayload: CreateUserPayload
  ): Observable<HttpResponse<CreateUserResult>> {
    const payload = new HttpParams()
      .set('email', createUserPayload.email)
      .set('username', createUserPayload.username)
      .set('password', createUserPayload.password);
    return this.http.post<CreateUserResult>(
      `${environment.apiUrl}${this.userPath}`,
      payload,
      {
        observe: 'response',
        withCredentials: true,
      }
    );
  }

  signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Observable<HttpResponse<UserLoginResult>> {
    const payload = new HttpParams()
      .set('email', email)
      .set('password', password);
    return this.http
      .post<UserLoginResult>(
        `${environment.apiUrl}${this.loginPath}`,
        payload,
        { observe: 'response', withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response.ok) {
            this.localStorageService.set(
              environment.tokenExpKey,
              response.body?.expiresIn as number
            );
          }
        })
      );
  }

  logInWithPlatform(platform: SupportedPlatform) {
    return this.http.get(
      `${environment.apiUrl}${this.userPath}/${platform.toLowerCase()}`
    );
  }

  updateProfile(
    payload: UpdateUserPayload
  ): Observable<HttpResponse<UpdateUserResult>> {
    return this.http.put<UpdateUserResult>(
      `${environment.apiUrl}${this.userPath}`,
      payload,
      {
        observe: 'response',
        withCredentials: true,
      }
    );
  }
}
