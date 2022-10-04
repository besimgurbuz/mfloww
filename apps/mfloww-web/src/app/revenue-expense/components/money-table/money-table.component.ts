import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Entry } from '../../../models/entry';

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

  get title() {
    return `${this.type}s`;
  }
}
