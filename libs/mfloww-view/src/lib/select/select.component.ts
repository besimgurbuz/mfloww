import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { merge, Observable, tap } from 'rxjs';
import { MflowwOptionComponent } from './components/option/option.component';

@Component({
  selector: 'mfloww-view-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwSelectComponent implements AfterViewInit {
  @Input() placeholder?: string;

  @Output() selection: EventEmitter<unknown> = new EventEmitter();

  @ContentChildren(MflowwOptionComponent)
  options!: QueryList<MflowwOptionComponent>;

  _opened = false;
  _options: MflowwOptionComponent[] = [];
  _selection$?: Observable<unknown>;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this._options = this.options.toArray();
    this._selection$ = merge(
      ...this.options.map((option) => option.selected)
    ).pipe(tap((value) => this.selection.emit(value)));
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this._opened) {
      // Click outside of element
      this._opened = false;
    }
  }
}
