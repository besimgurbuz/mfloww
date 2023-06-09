import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Icon } from './icon';
import { ICON_SVG_PATHS } from './svg-paths';

@Component({
  selector: 'mfloww-view-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwIconComponent {
  @Input() type!: Icon;

  _iconPaths: Record<Icon, string[]> = ICON_SVG_PATHS;
}
