/* eslint-disable @typescript-eslint/no-empty-function */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MflowwSelectOptionDirective } from './directives/select-option.directive';

@Component({
  selector: 'mfloww-view-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MflowwSelectComponent,
    },
  ],
})
export class MflowwSelectComponent<T>
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  @Input() placeholder?: string;
  @Input() borderless = false;

  @Output() selection: EventEmitter<T> = new EventEmitter();

  @ContentChildren(MflowwSelectOptionDirective)
  options!: QueryList<MflowwSelectOptionDirective<T>>;

  _opened = false;
  _options: MflowwSelectOptionDirective<T>[] = [];
  _selectedOptionTemplate?: TemplateRef<HTMLElement>;
  _value?: T;
  _disabled = false;
  _touched = false;
  _selectionSubs?: Subscription;
  _optionChangeSubs?: Subscription;
  _onTouched?: () => void = () => {};
  _onChange: (value: T) => void = () => {};

  constructor(private elementRef: ElementRef, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this._options = this.options.toArray();
    this.setInitialSelection();
    this._optionChangeSubs = this.options.changes.subscribe(() => {
      this._options = this.options.toArray();
      this.setInitialSelection();
    });
  }

  ngOnDestroy(): void {
    this._selectionSubs?.unsubscribe();
    this._optionChangeSubs?.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this._opened) {
      // Click outside of element
      this._opened = false;
    }
  }

  handleSelectButtonClick(): void {
    if (this._disabled) {
      return;
    }
    this._opened = !this._opened;
  }

  handleOptionClick(option: MflowwSelectOptionDirective<T>): void {
    this._selectedOptionTemplate = option.template;
    const value = option.value;
    this._value = value;
    this._opened = false;
    this.markAsTouched();
    this.selection.emit(value);
    this._onChange(value);
  }

  writeValue(obj: T): void {
    this._value = obj;
  }

  registerOnChange(fn: (val: T) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  private markAsTouched(): void {
    if (!this._touched) {
      this._onTouched?.();
      this._touched = true;
    }
  }

  private setInitialSelection() {
    if (this.options.length <= 0) return;

    const selected = this.options.find((option) => option.selected);
    if (!selected) return;
    const initialValue = selected?.value;
    if (!initialValue) {
      throw new Error(
        '[MflowwSelectComponent]: Initial value should be given for selected option'
      );
    }

    this._selectedOptionTemplate = selected.template;
    this.markAsTouched();
    this._onChange(initialValue);
    this._value = initialValue;
    this.selection.emit(initialValue);
    this.cd.detectChanges();
  }
}
