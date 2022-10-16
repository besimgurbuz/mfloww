import { TestBed } from '@angular/core/testing';

import { ErrorMessengerService } from './error-messenger.service';

describe('ErrorMessengerService', () => {
  let service: ErrorMessengerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMessengerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
