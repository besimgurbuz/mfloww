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
  @Input() selected = false;
  @Output() selection: EventEmitter<T> = new EventEmitter();

  @ViewChild('option')
  public template!: TemplateRef<HTMLElement>;

  handleOptionClick() {
    this.selection.emit(this.value);
  }
}
