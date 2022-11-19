import { Injectable } from '@angular/core';
import { lib } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoSecretService {
  private CRYPTO_SECRET = lib.WordArray.random(16).toString();

  set secret(secret: string) {
    this.CRYPTO_SECRET = secret;
  }

  get secret(): string {
    return this.CRYPTO_SECRET;
  }
}
