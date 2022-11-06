import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MflowwMonthYearPickerComponent } from './month-year-picker.component';

describe('MonthYearPickerComponent', () => {
  let component: MflowwMonthYearPickerComponent;
  let fixture: ComponentFixture<MflowwMonthYearPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MflowwMonthYearPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MflowwMonthYearPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
