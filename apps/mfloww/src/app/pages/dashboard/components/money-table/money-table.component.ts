import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  BalanceRecordType,
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from '@mfloww/common';
import {
  MflowwButtonComponent,
  MflowwEntryInputComponent,
  MflowwIconComponent,
} from '@mfloww/view';
import { TranslocoDirective } from '@ngneat/transloco';
import { BalanceRecord } from '../../models/entry';
import { MoneyTableEntryComponent } from '../money-table-entry/money-table-entry.component';

@Component({
  selector: 'mfloww-money-table',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    MoneyTableEntryComponent,
    MflowwIconComponent,
    MflowwEntryInputComponent,
    MflowwButtonComponent,
  ],
  templateUrl: './money-table.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MoneyTableComponent {
  @Input() set type(recordType: BalanceRecordType) {
    this._type = recordType;
  }
  get type() {
    return this._type;
  }
  _type: BalanceRecordType = 'revenue';
  @Input() baseCurrency: SupportedCurrencyCode = 'USD';
  @Input() sizePercentageMap: Record<number, number> = {};
  @Input() entries: BalanceRecord[] = [];
  @Input() total = 0;

  @Output() entryCreation: EventEmitter<BalanceRecord> = new EventEmitter();
  @Output() entryDeletion: EventEmitter<number> = new EventEmitter();

  _titlesMap: Record<BalanceRecordType, string> = {
    revenue: 'Balance.Revenues',
    expense: 'Balance.Expenses',
  };
  _addingModeActive = false;
  _classMap: Record<BalanceRecordType, string> = {
    revenue: 'text-mfloww_success md:pr-6 md:flex-row-reverse',
    expense: 'text-mfloww_fatal md:pl-6',
  };

  get currencies(): SupportedCurrencyCode[] {
    return SUPPORTED_CURRENCY_CODES;
  }

  handleNewEntry(entry: BalanceRecord) {
    this.entryCreation.emit(entry);
    this._addingModeActive = false;
  }

  handleDeletion(index: number): void {
    this.entryDeletion.emit(index);
  }
}