import { CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SupportedCurrencyCode } from '@mfloww/common';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'mfloww-overall',
  standalone: true,
  imports: [NgClass, CurrencyPipe, TranslocoPipe],
  templateUrl: './overall-panel.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallComponent {
  @Input() overallTotal = 0;
  @Input() currency: SupportedCurrencyCode = 'USD';
}
