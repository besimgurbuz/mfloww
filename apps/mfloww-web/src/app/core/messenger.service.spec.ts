import { TestBed } from '@angular/core/testing';

import { MessengerService } from './messenger.service';

describe('ErrorMessengerService', () => {
  let service: MessengerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessengerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
