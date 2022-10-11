/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Injector,
  INJECTOR,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ERROR_MESSAGES } from './input-errors';

@Component({
  selector: 'mfloww-view-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MflowwInputComponent,
    },
  ],
})
export class MflowwInputComponent implements ControlValueAccessor, OnInit {
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() name!: string;

  _control!: FormControl;
  errorMessages = ERROR_MESSAGES;
  _value = '';
  _disabled = false;
  _touched = false;
  _focused = false;
  _onTouched: () => void = () => {};
  _onChange: (value: string) => void = () => {};

  constructor(
    @Inject(INJECTOR) private injector: Injector,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this._control = this.injector.get(NgControl) as unknown as FormControl;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (
      !this.elementRef.nativeElement.contains(event.target) &&
      this._focused
    ) {
      // Click outside of element
      this.markAsTouched();
    }
  }

  writeValue(value: string): void {
    this._value = value;
  }

  registerOnChange(fn: (val: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  onValueChanged(value: string) {
    this._value = value;
    this.markAsTouched();
    this._onChange(value);
    console.log(this._control.errors);
  }

  private markAsTouched() {
    if (!this._touched) {
      this._touched = true;
      this._onTouched();
    }
  }
}
