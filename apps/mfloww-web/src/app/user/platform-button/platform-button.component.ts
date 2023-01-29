import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SupportedPlatform } from '@mfloww/common';

@Component({
  selector: 'mfloww-platform-button',
  templateUrl: './platform-button.component.html',
  styleUrls: ['./platform-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformButtonComponent {
  @Input() platfrom!: SupportedPlatform;
}
