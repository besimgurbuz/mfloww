import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SupportedCurrency } from '../../../models/currency';

@Component({
  selector: 'mfloww-money-table-entry',
  templateUrl: './money-table-entry.component.html',
  styleUrls: ['./money-table-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyTableEntryComponent {
  @Input() type: 'revenue' | 'expense' = 'revenue';
  @Input() currency!: SupportedCurrency;
  @Input() amount!: number;
  @Input() label!: string;
}
