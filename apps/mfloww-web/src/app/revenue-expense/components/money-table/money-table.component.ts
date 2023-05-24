import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RevenueExpenseRecordType,
  SUPPORTED_CURRENCY_LIST,
  SupportedCurrency,
} from '@mfloww/common';
import { RevenueExpenseRecord } from '../../../models/entry';

@Component({
  selector: 'mfloww-money-table',
  templateUrl: './money-table.component.html',
  styleUrls: ['./money-table.component.scss'],
})
export class MoneyTableComponent {
  @Input() type: RevenueExpenseRecordType = 'revenue';
  @Input() baseCurrency: SupportedCurrency = 'USD';
  @Input() sizePercentageMap: Record<number, number> = {};
  @Input() entries: RevenueExpenseRecord[] = [];
  @Input() total = 0;

  @Output() entryCreation: EventEmitter<RevenueExpenseRecord> =
    new EventEmitter();
  @Output() entryDeletion: EventEmitter<number> = new EventEmitter();

  _addingModeActive = false;
  _classMap: Record<RevenueExpenseRecordType, string> = {
    revenue: 'text-mfloww_success pr-10',
    expense: 'text-mfloww_fatal pl-10',
  };

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
