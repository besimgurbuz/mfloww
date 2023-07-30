import { TestBed } from '@angular/core/testing';

import { BalanceDataService } from './balance-data.service';

describe('BalanceDataService', () => {
  let service: BalanceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalanceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
