import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  set(key: string, value: string | number | boolean | symbol) {
    localStorage.setItem(key, value.toString());
  }

  get<T>(key: string): T | null {
    return localStorage.getItem(key) as T;
  }

  getNumber(key: string): number {
    return Number(localStorage.getItem(key));
  }
}
