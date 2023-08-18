import { CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SupportedCurrencyCode } from '@mfloww/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mfloww-overall',
  templateUrl: './overall-panel.component.html',
  styleUrls: ['./overall-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, CurrencyPipe, TranslateModule],
})
export class OverallComponent {
  @Input() overallTotal = 0;
  @Input() currency: SupportedCurrencyCode = 'USD';
}
