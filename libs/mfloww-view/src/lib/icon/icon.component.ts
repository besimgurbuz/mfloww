import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Icon, ICON_SVG_PATHS } from './icon';

@Component({
  selector: 'mfloww-view-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwIconComponent {
  @Input() type!: Icon;
  @Input() color = 'white';
  @Input() viewBox?: number;

  _iconPaths: Record<Icon, string[]> = ICON_SVG_PATHS;

  get viewBoxProp() {
    return `0 0 ${this.viewBox || 20} ${this.viewBox || 20}`;
  }
}
