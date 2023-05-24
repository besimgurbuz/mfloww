import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { RevenueExpenseRecordType, SupportedCurrency } from '@mfloww/common';

@Component({
  selector: 'mfloww-money-table-entry',
  templateUrl: './money-table-entry.component.html',
  styleUrls: ['./money-table-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyTableEntryComponent {
  @Input() type: RevenueExpenseRecordType = 'revenue';
  @Input() currency: SupportedCurrency = 'USD';
  @Input() set sizePercentage(percentage: number) {
    if (!percentage) return;
    this._sizePercentage = percentage;
    const barWidth = this.calculateWithFromPercentage(percentage);
    this._shouldShowLabelOutside =
      barWidth <= (`${this.amount}`.length + 4) * 15 + this.label.length * 14;
    this._shouldShowAmountOutside =
      barWidth <= (`${this.amount}`.length + 4) * 15;
  }
  get sizePercentage() {
    return this._sizePercentage;
  }
  _sizePercentage = 0;
  @Input() amount!: number;
  @Input() label!: string;
  @Input() deletable = false;

  @Output() deletionTriggered: EventEmitter<void> = new EventEmitter();

  @ViewChild('entryContainer', { static: true })
  entryContainer!: ElementRef<HTMLDivElement>;

  _barClassMap: Record<RevenueExpenseRecordType, string[]> = {
    revenue: [
      'bg-mfloww_success',
      'rounded-l',
      'justify-start',
      'px-2',
      'order-3',
    ],
    expense: ['bg-mfloww_fatal', 'rounded-r', 'justify-end', 'px-2', 'order-1'],
  };
  _shouldShowLabelOutside?: boolean;
  _shouldShowAmountOutside?: boolean;

  constructor(private cd: ChangeDetectorRef) {}

  private calculateWithFromPercentage(percentage: number) {
    const totalWidth = this.entryContainer?.nativeElement?.clientWidth || 200;
    return (percentage * totalWidth) / 100;
  }
}
