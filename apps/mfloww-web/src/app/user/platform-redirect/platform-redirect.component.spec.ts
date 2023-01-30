import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformRedirectComponent } from './platform-redirect.component';

describe('PlatformRedirectComponent', () => {
  let component: PlatformRedirectComponent;
  let fixture: ComponentFixture<PlatformRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlatformRedirectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
