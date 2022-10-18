import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateUserPayload,
  CreateUserResult,
  UserLoginResult,
} from '../models/user';

@Injectable()
export class UserService {
  private readonly createUserPath = '/api/user';
  private readonly loginPath = '/api/auth/login';
  constructor(private http: HttpClient) {}

  createUser(
    payload: CreateUserPayload
  ): Observable<HttpResponse<CreateUserResult>> {
    return this.http.post<CreateUserResult>(
      `${environment.apiUrl}${this.createUserPath}`,
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
    return this.http.post<UserLoginResult>(
      `${environment.apiUrl}${this.loginPath}`,
      {
        email,
        password,
      },
      { observe: 'response', withCredentials: true }
    );
  }
}
