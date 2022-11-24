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
      class="hover:opacity-80 flex items-center justify-center w-full h-full p-[2px] active:p-0 focus:p-0 active:border-2 focus:border-2 active:border-solid focus:border-solid focus:border-mfloww_fg active:rounded-full focus:rounded-full"
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
