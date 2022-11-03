import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RevenueExpenseRecordType } from '@mfloww/common';
import { RevenueExpenseRecord } from '../../../models/entry';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'mfloww-money-table',
  templateUrl: './money-table.component.html',
  styleUrls: ['./money-table.component.scss'],
})
export class MoneyTableComponent {
  @Input() type: RevenueExpenseRecordType = 'revenue';
  @Input() entries: RevenueExpenseRecord[] = [];
  @Input() total = 0;

  @Output() entryCreation: EventEmitter<RevenueExpenseRecord> =
    new EventEmitter();

  _addingModeActive = false;

  constructor(private currencyService: CurrencyService) {}

  get title() {
    return `${this.type}s`;
  }

  get currencies() {
    return this.currencyService.getSupportedCurrencies();
  }

  handleNewEntry(entry: RevenueExpenseRecord) {
    this.entryCreation.emit(entry);
    this._addingModeActive = false;
  }
}
