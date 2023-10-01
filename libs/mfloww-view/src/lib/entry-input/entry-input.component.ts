import { CommonModule } from '@angular/common';
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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BalanceRecordType,
  SUPPORTED_CURRENCIES,
  SupportedCurrencyCode,
} from '@mfloww/common';
import { filter } from 'rxjs';
import { MflowwIconComponent } from '../icon/icon.component';
import { MflowwSelectComponent } from '../select/select.component';

@Component({
  selector: 'mfloww-view-entry-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MflowwSelectComponent,
    MflowwIconComponent,
  ],
  templateUrl: './entry-input.component.html',
  styleUrls: ['./entry-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwEntryInputComponent implements AfterViewInit {
  @Input() set selectedCurrency(currency: SupportedCurrencyCode) {
    if (currency) {
      this._entryFormGroup.get('currency')?.setValue(currency);
    }
  }
  @Input() autofocus = false;
  @Input() entryType: BalanceRecordType = 'revenue';

  @ViewChild('amountInput')
  amountInputEl!: ElementRef<HTMLInputElement>;

  @Output() entryCreated: EventEmitter<{
    currency: SupportedCurrencyCode;
    amount: number;
    label: string;
  }> = new EventEmitter();

  _entryFormGroup: FormGroup = this.formBuilder.group({
    currency: ['USD', [Validators.required]],
    amount: ['', [Validators.required]],
    label: ['', Validators.required],
  });
  _currencies = SUPPORTED_CURRENCIES;

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

  handleEntrySubmit() {
    if (this._entryFormGroup.valid) {
      this.entryCreated.emit(this._entryFormGroup.value);
      this._entryFormGroup.reset();
    }
  }
}
