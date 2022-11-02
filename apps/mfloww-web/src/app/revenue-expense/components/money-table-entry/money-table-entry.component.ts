import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RevenueExpenseRecordType, SupportedCurrency } from '@mfloww/common';

@Component({
  selector: 'mfloww-money-table-entry',
  templateUrl: './money-table-entry.component.html',
  styleUrls: ['./money-table-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyTableEntryComponent {
  @Input() type: RevenueExpenseRecordType = 'revenue';
  @Input() currency: SupportedCurrency = SupportedCurrency.USD;
  @Input() amount!: number;
  @Input() label!: string;
}
