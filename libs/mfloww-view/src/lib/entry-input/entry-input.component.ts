import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SupportedCurrency } from '@mfloww/common';

@Component({
  selector: 'mfloww-view-entry-input',
  templateUrl: './entry-input.component.html',
  styleUrls: ['./entry-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwEntryInputComponent {
  @Input() currencies: SupportedCurrency[] = [];
}
