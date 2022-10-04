import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Entry } from '../../../models/entry';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'mfloww-money-table',
  templateUrl: './money-table.component.html',
  styleUrls: ['./money-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyTableComponent {
  @Input() type: 'revenue' | 'expense' = 'revenue';
  @Input() entries: Entry[] = [];
  @Input() total = 0;

  _addingModeActive = false;

  constructor(private currencyService: CurrencyService) {}

  get title() {
    return `${this.type}s`;
  }

  get currencies() {
    return this.currencyService.getSupportedCurrencies();
  }
}
