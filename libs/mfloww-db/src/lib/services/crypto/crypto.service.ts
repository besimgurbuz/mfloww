import { inject, Injectable } from '@angular/core';
import crypto from 'crypto-js';
import { CryptoSecretService } from './crypto-secret.service';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly secretService = inject(CryptoSecretService);

  encrypt(value: string): string {
    return crypto.AES.encrypt(value, this.secretService.secret).toString();
  }

  decrypt(encryptedText: string): string {
    return crypto.AES.decrypt(
      encryptedText,
      this.secretService.secret
    ).toString();
  }

  decryptObject<T>(encryptedText: string): T {
    const result = crypto.AES.decrypt(
      encryptedText,
      this.secretService.secret
    ).toString(crypto.enc.Utf8);
    return JSON.parse(result) as T;
  }
}
