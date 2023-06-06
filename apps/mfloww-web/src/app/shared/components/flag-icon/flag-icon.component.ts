import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SupportedLanguage } from '@mfloww/common';

@Component({
  selector: 'mfloww-flag-icon',
  templateUrl: './flag-icon.component.html',
  styleUrls: ['./flag-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlagIconComponent {
  @Input() flagCode!: SupportedLanguage;
}
