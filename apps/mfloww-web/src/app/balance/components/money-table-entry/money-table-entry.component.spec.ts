import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyTableEntryComponent } from './money-table-entry.component';

describe('MoneyTableEntryComponent', () => {
  let component: MoneyTableEntryComponent;
  let fixture: ComponentFixture<MoneyTableEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyTableEntryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoneyTableEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
