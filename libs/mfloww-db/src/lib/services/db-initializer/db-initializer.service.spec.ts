import { TestBed } from '@angular/core/testing';

import { DbInitializerService } from './db-initializer.service';

describe('DbInitializerService', () => {
  let service: DbInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
