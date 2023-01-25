import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  createUser(
    payload: CreateUserPayload
  ): Observable<HttpResponse<CreateUserResult>> {
    return this.http.post<CreateUserResult>(
      `${environment.apiUrl}${this.userPath}`,
      payload,
      {
        observe: 'response',
        withCredentials: true,
      }
    );
  }

  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Observable<HttpResponse<UserLoginResult>> {
    return this.http
      .post<UserLoginResult>(
        `${environment.apiUrl}${this.loginPath}`,
        {
          email,
          password,
        },
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
