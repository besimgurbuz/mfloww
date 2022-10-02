import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MflowwSelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: MflowwSelectComponent;
  let fixture: ComponentFixture<MflowwSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MflowwSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MflowwSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
