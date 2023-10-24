import { Injectable } from '@angular/core';
import crypto from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoSecretService {
  private CRYPTO_SECRET = crypto.lib.WordArray.random(16).toString();

  set secret(secret: string) {
    this.CRYPTO_SECRET = secret;
  }

  get secret(): string {
    return this.CRYPTO_SECRET;
  }
}
