import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RevenueExpenseRecordType, SupportedCurrency } from '@mfloww/common';
import { filter } from 'rxjs';

@Component({
  selector: 'mfloww-view-entry-input',
  templateUrl: './entry-input.component.html',
  styleUrls: ['./entry-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwEntryInputComponent implements AfterViewInit {
  @Input() currencies: SupportedCurrency[] = [];
  @Input() set selectedCurrency(currency: SupportedCurrency) {
    if (currency) {
      this._entryFormGroup.get('currency')?.setValue(currency);
    }
  }
  @Input() autofocus = false;
  @Input() entryType: RevenueExpenseRecordType = 'revenue';

  @ViewChild('amountInput')
  amountInputEl!: ElementRef<HTMLInputElement>;

  @Output() entryCreated: EventEmitter<{
    currency: SupportedCurrency;
    amount: number;
    label: string;
  }> = new EventEmitter();

  _entryFormGroup: FormGroup = this.formBuilder.group({
    currency: ['USD', [Validators.required]],
    amount: ['', [Validators.required]],
    label: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {
    const amountControl = this._entryFormGroup.get('amount');
    amountControl?.valueChanges
      .pipe(
        filter((amountValue) => {
          return (
            (this.entryType === 'revenue' && amountValue < 0) ||
            (this.entryType === 'expense' && amountValue > 0)
          );
        })
      )
      .subscribe((amountValue) => {
        amountControl.setValue(amountValue * -1, { emitEvent: false });
      });
  }

  ngAfterViewInit(): void {
    if (this.autofocus) {
      this.amountInputEl.nativeElement.focus();
    }
  }

  handleEntrySubmit(event?: Event) {
    if (event) event.preventDefault();
    if (this._entryFormGroup.valid) {
      this.entryCreated.emit(this._entryFormGroup.value);
      this._entryFormGroup.reset();
    }
  }
}
