import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueExpenseComponent } from './revenue-expense.component';

describe('RevenueExpenseComponent', () => {
  let component: RevenueExpenseComponent;
  let fixture: ComponentFixture<RevenueExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevenueExpenseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RevenueExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
