import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'mfloww-view-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwOptionComponent<T> {
  @Input() value!: T;

  @Output() selected: EventEmitter<T> = new EventEmitter();

  @ViewChild('option')
  public template!: TemplateRef<HTMLElement>;

  handleOptionClick() {
    this.selected.emit(this.value);
  }
}
