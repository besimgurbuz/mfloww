import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MflowwProgressBarComponent } from './progress-bar.component';

describe('InProgressModalComponent', () => {
  let component: MflowwProgressBarComponent;
  let fixture: ComponentFixture<MflowwProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MflowwProgressBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MflowwProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
