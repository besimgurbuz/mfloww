import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RevenueExpenseRecordType,
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from '@mfloww/common';
import { RevenueExpenseRecord } from '../../../models/entry';

@Component({
  selector: 'mfloww-money-table',
  templateUrl: './money-table.component.html',
  styleUrls: ['./money-table.component.scss'],
})
export class MoneyTableComponent {
  @Input() set type(recordType: RevenueExpenseRecordType) {
    this._type = recordType;
  }
  get type() {
    return this._type;
  }
  _type: RevenueExpenseRecordType = 'revenue';
  @Input() baseCurrency: SupportedCurrencyCode = 'USD';
  @Input() sizePercentageMap: Record<number, number> = {};
  @Input() entries: RevenueExpenseRecord[] = [];
  @Input() total = 0;

  @Output() entryCreation: EventEmitter<RevenueExpenseRecord> =
    new EventEmitter();
  @Output() entryDeletion: EventEmitter<number> = new EventEmitter();

  _titlesMap: Record<RevenueExpenseRecordType, string> = {
    revenue: 'RevenueExpense.Revenues',
    expense: 'RevenueExpense.Expenses',
  };
  _addingModeActive = false;
  _classMap: Record<RevenueExpenseRecordType, string> = {
    revenue: 'text-mfloww_success md:pr-6 md:flex-row-reverse',
    expense: 'text-mfloww_fatal md:pl-6',
  };

  get currencies(): SupportedCurrencyCode[] {
    return SUPPORTED_CURRENCY_CODES;
  }

  handleNewEntry(entry: RevenueExpenseRecord) {
    this.entryCreation.emit(entry);
    this._addingModeActive = false;
  }

  handleDeletion(index: number): void {
    this.entryDeletion.emit(index);
  }
}
