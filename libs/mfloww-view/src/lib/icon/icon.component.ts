import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Icon, ICON_SVG_PATHS } from './icon';

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
  @Input() size = 20;
  @Input() type!: Icon;
  @Input() color = 'white';

  _iconPaths: Record<Icon, string[]> = ICON_SVG_PATHS;
}
