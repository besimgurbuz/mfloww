import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTableComponent } from './overall-panel.component';

describe('OverallPanelComponent', () => {
  let component: OverallTableComponent;
  let fixture: ComponentFixture<OverallTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverallTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverallTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
