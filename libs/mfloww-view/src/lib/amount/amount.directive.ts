import { Directive, Host, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { RevenueExpenseRecordType } from '@mfloww/common';

@Directive({
  selector: 'input[mflowwViewAmount]',
  standalone: true,
})
export class MflowwAmountDirective implements OnInit {
  @Input() mflowwViewAmountType: RevenueExpenseRecordType = 'revenue';

  _latestValidInput?: number;

  constructor(@Host() private ngControl: NgControl) {}

  ngOnInit(): void {
    this.ngControl.valueChanges?.subscribe((value) => {
      if (!value) {
        this.ngControl.valueAccessor?.writeValue('');
        return;
      }
      if (/[0-9]+/g.test(value)) {
        this._latestValidInput = Number(value);
      }
      this.ngControl.valueAccessor?.writeValue(
        this.getTypedValue(this._latestValidInput as number)
      );
    });
  }

  private getTypedValue(value: number) {
    if (value < 0) {
      return this.mflowwViewAmountType === 'revenue' ? value * -1 : value;
    } else {
      return this.mflowwViewAmountType === 'expense' ? value * -1 : value;
    }
  }
}
