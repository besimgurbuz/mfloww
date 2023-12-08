/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
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
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { map, of } from 'rxjs';

import { MflowwCopyClipboardDirective } from '../copy-clipboard/copy-clipboard.directive';
import { ERROR_MESSAGES } from './input-errors';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MflowwCopyClipboardDirective,
    TranslocoDirective,
  ],
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

  private injector = inject(INJECTOR);
  private formGroup = inject(FormGroupDirective);
  private cd = inject(ChangeDetectorRef);

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
    this.cd.detectChanges();
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
