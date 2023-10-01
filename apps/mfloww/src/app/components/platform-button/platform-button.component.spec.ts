import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformButtonComponent } from './platform-button.component';

describe('PlatformButtonComponent', () => {
  let component: PlatformButtonComponent;
  let fixture: ComponentFixture<PlatformButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlatformButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
