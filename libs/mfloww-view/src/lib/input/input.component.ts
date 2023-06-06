/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Injector,
  INJECTOR,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { map, of } from 'rxjs';
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
  @Input() autocomplete:
    | string
    | 'on'
    | 'off'
    | 'current-password'
    | 'new-password' = 'off';
  @Input() name!: string;
  @Input() label?: string;
  @Input() copyable?: boolean;

  _control!: FormControl;
  errorMessages = ERROR_MESSAGES;
  _value = '';
  _disabled = false;
  _touched = false;
  _focused = false;
  _dirty = false;
  _copied = false;

  _formGroupSubmittedWithErrors =
    this.formGroup?.ngSubmit
      ?.asObservable()
      ?.pipe(map(() => this.formGroup.invalid)) || of(false);
  _onTouched: () => void = () => {};
  _onChange: (value: string) => void = () => {};

  constructor(
    @Inject(INJECTOR) private injector: Injector,
    private formGroup: FormGroupDirective,
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._control = this.injector.get(NgControl) as unknown as FormControl;
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
    this._dirty = true;
    this.markAsTouched();
    this._onChange(value);
  }

  informCopyEvent() {
    this._copied = true;
    setTimeout(() => {
      this._copied = false;
      this.cd.detectChanges();
    }, 1000);
  }

  private markAsTouched() {
    if (!this._touched) {
      this._touched = true;
      this._onTouched();
    }
  }
}
