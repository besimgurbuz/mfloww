import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'mfloww-view-button',
  template: `
    <button
      class="hover:opacity-80 flex items-center justify-center w-full h-full border-2 border-solid rounded-full border-transparent focus:border-mfloww_fg "
      (click)="clicked.emit()"
    >
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MflowwButtonComponent {
  @Output() clicked: EventEmitter<void> = new EventEmitter();
}
