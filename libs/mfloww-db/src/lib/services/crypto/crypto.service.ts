import { inject, Injectable } from '@angular/core';
import { AES } from 'crypto-js';
import { CryptoSecretService } from './crypto-secret.service';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly secretService = inject(CryptoSecretService);

  encrypt(value: string): string {
    return AES.encrypt(value, this.secretService.secret).toString();
  }

  decrypt(encryptedText: string): string {
    return AES.decrypt(encryptedText, this.secretService.secret).toString();
  }

  decryptObject<T>(encryptedText: string): T {
    return JSON.parse(
      AES.decrypt(encryptedText, this.secretService.secret).toString()
    ) as T;
  }
}
