import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RevenueExpenseRecordType,
  SUPPORTED_CURRENCY_LIST,
  SupportedCurrency,
} from '@mfloww/common';
import { RevenueExpenseRecord } from '../../../models/entry';
import { ExchangeService } from '../../services/exchange.service';

@Component({
  selector: 'mfloww-money-table',
  templateUrl: './money-table.component.html',
  styleUrls: ['./money-table.component.scss'],
})
export class MoneyTableComponent {
  @Input() type: RevenueExpenseRecordType = 'revenue';
  @Input() baseCurrency: SupportedCurrency = 'USD';
  @Input() entries: RevenueExpenseRecord[] = [];
  @Input() total = 0;

  @Output() entryCreation: EventEmitter<RevenueExpenseRecord> =
    new EventEmitter();
  @Output() entryDeletion: EventEmitter<number> = new EventEmitter();

  _addingModeActive = false;

  constructor(private currencyService: ExchangeService) {}

  get title() {
    return `${this.type}s`;
  }

  get currencies() {
    return SUPPORTED_CURRENCY_LIST;
  }

  handleNewEntry(entry: RevenueExpenseRecord) {
    this.entryCreation.emit(entry);
    this._addingModeActive = false;
  }

  handleDeletion(index: number): void {
    this.entryDeletion.emit(index);
  }
}
