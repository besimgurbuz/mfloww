import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Entry } from '../../../models/entry';
import { CalculatorService } from '../../services/calculator.service';

@Component({
  selector: 'mfloww-money-table',
  templateUrl: './money-table.component.html',
  styleUrls: ['./money-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyTableComponent {
  @Input() type: 'revenue' | 'expense' = 'revenue';

  @Input() entries: Entry[] = [];

  constructor(private calculatorService: CalculatorService) {}

  get title() {
    return `${this.type}s`;
  }

  get sumOfEntries(): number {
    return this.entries ? this.calculatorService.sumOfEntries(this.entries) : 0;
  }
}
