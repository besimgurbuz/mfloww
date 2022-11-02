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

@Component({
  selector: 'mfloww-view-entry-input',
  templateUrl: './entry-input.component.html',
  styleUrls: ['./entry-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwEntryInputComponent implements AfterViewInit {
  @Input() currencies: SupportedCurrency[] = [];
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
    currency: ['', [Validators.required]],
    amount: ['', [Validators.required]],
    label: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {}

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
