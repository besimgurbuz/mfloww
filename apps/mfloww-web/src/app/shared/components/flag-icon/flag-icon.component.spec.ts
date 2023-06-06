import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagIconComponent } from './flag-icon.component';

describe('FlagIconComponent', () => {
  let component: FlagIconComponent;
  let fixture: ComponentFixture<FlagIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlagIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlagIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
