import { NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SupportedLanguage } from '@mfloww/common';

@Component({
  standalone: true,
  selector: 'mfloww-flag-icon',
  templateUrl: './flag-icon.component.html',
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      svg {
        width: 24px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgSwitch, NgSwitchCase],
})
export class FlagIconComponent {
  @Input() flagCode!: SupportedLanguage;
}
