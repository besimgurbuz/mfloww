import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportedCurrency } from '@mfloww/common';

@Component({
  selector: 'mfloww-view-entry-input',
  templateUrl: './entry-input.component.html',
  styleUrls: ['./entry-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwEntryInputComponent {
  @Input() currencies: SupportedCurrency[] = [];

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

  handleEntrySubmit() {
    if (this._entryFormGroup.valid) {
      this.entryCreated.emit(this._entryFormGroup.value);
      this._entryFormGroup.reset();
    }
  }
}
