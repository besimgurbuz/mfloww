import { TestBed } from '@angular/core/testing';

import { RevenueExpenseEntryService } from './revenue-expense-entry.service';

describe('RevenueExpenseEntryService', () => {
  let service: RevenueExpenseEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevenueExpenseEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
