import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CryptoSecretService {
  private CRYPTO_SECRET = window.crypto.randomUUID();

  set secret(secret: string) {
    this.CRYPTO_SECRET = secret;
  }

  get secret(): string {
    return this.CRYPTO_SECRET;
  }
}
