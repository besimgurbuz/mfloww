import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'mfloww-view-button',
  template: `
    <button
      class="hover:opacity-80 flex items-center justify-center w-full h-full border-2 border-solid rounded-full border-transparent focus:border-mfloww_fg"
      [class.!border-mfloww_fg]="showBorder"
      (click)="clicked.emit()"
    >
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class MflowwButtonComponent {
  @Input({ transform: booleanAttribute }) showBorder = false;

  @Output() clicked: EventEmitter<void> = new EventEmitter();
}
