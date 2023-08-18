import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallComponent } from './overall-panel.component';

describe('OverallPanelComponent', () => {
  let component: OverallComponent;
  let fixture: ComponentFixture<OverallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverallComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
