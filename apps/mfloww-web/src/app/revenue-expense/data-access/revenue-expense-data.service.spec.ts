import { TestBed } from '@angular/core/testing';

import { RevenueExpenseDataService } from './revenue-expense-data.service';

describe('RevenueExpenseDataService', () => {
  let service: RevenueExpenseDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevenueExpenseDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
