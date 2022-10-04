import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MflowwEntryInputComponent } from './entry-input.component';

describe('MflowwEntryInputComponent', () => {
  let component: MflowwEntryInputComponent;
  let fixture: ComponentFixture<MflowwEntryInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MflowwEntryInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MflowwEntryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
