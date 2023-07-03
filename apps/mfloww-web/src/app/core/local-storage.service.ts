import { Injectable, inject } from '@angular/core';
import { LocalStorageToken } from './local-storage.token';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private localStorage = inject(LocalStorageToken);

  set(key: string, value: string | number | boolean | symbol) {
    if (!value) return;
    this.localStorage.setItem(key, value.toString());
  }

  get<T>(key: string): T | null {
    return (this.localStorage.getItem(key) as T) || null;
  }

  remove(key: string): void {
    this.localStorage.removeItem(key);
  }

  getNumber(key: string): number {
    return Number(this.localStorage.getItem(key));
  }
}
