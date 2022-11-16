import { TestBed } from '@angular/core/testing';

import { CryptoSecretService } from './crypto-secret.service';

describe('CryptoSecretService', () => {
  let service: CryptoSecretService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoSecretService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
