import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mfloww-view-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styles: [
    `
      :host {
        display: block;
        width: fit-content;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwIconComponent {
  @Input() type!: 'arrow_down' | 'filled_plus';

  @Input() color!: string;
}
