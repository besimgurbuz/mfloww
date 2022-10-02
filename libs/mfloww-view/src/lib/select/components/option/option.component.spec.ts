import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MflowwOptionComponent } from './option.component';

describe('OptionComponent', () => {
  let component: MflowwOptionComponent;
  let fixture: ComponentFixture<MflowwOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MflowwOptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MflowwOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
