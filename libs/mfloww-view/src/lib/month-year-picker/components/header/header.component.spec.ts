import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MflowwMonthYearHeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: MflowwMonthYearHeaderComponent;
  let fixture: ComponentFixture<MflowwMonthYearHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MflowwMonthYearHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MflowwMonthYearHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
