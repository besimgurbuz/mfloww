import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { merge, Observable, ReplaySubject, tap } from 'rxjs';
import { MflowwOptionComponent } from './components/option/option.component';

@Component({
  selector: 'mfloww-view-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwSelectComponent<T>
  implements ControlValueAccessor, OnInit, AfterViewInit
{
  @Input() placeholder?: string;
  @Input() borderless = false;
  @Input() set value(value: T) {
    this._defaultValue.next(value);
  }
  @Input() formControl?: FormControl;
  @Input() formControlName?: string;

  @Output() selection: EventEmitter<T> = new EventEmitter();

  @ContentChildren(MflowwOptionComponent)
  options!: QueryList<MflowwOptionComponent<T>>;

  _opened = false;
  _options: MflowwOptionComponent<T>[] = [];
  _selection$?: Observable<T>;
  _defaultValue: ReplaySubject<T> = new ReplaySubject();

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this._selection$ = this._defaultValue.asObservable();
  }

  ngAfterViewInit(): void {
    this._options = this.options.toArray();
    this._selection$ = merge(
      ...this.options.map((option) => option.selected),
      this._defaultValue
    ).pipe(tap((value) => this.selection.emit(value)));
  }

  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }

  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }

  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this._opened) {
      // Click outside of element
      this._opened = false;
    }
  }
}
