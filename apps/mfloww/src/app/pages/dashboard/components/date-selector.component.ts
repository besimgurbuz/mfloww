import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MflowwButtonComponent, MflowwIconComponent } from '@mfloww/view';
import { TranslocoDirective } from '@ngneat/transloco';
import { LATEST_DATE_KEY } from '../../../core/core.constants';
import { LocalStorageService } from '../../../core/local-storage.service';
import { EntryDatePipe } from '../pipes/entry-date/entry-date.pipe';

@Component({
  selector: 'mfloww-date-selector',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    EntryDatePipe,
    MflowwButtonComponent,
    MflowwIconComponent,
    TranslocoDirective,
    ReactiveFormsModule,
  ],
  template: `
    <ng-container *transloco="let t">
      <div class="flex gap-2 justify-center" *ngIf="dates?.length">
        <mfloww-view-button
          class="w-10"
          [class.invisible]="_showPrevBtn()"
          (clicked)="setPrevDateAsSelected()"
        >
          <mfloww-view-icon type="arrow_left"></mfloww-view-icon>
        </mfloww-view-button>
        <select
          [attr.placeholder]="t('Balance.SelectAMonth')"
          class="bg-mfloww_bg font-roboto border-2 border-solid border-mfloww_fg rounded p-1 text-sm"
          [formControl]="_formControl"
        >
          <option value disabled selected>
            {{ t('Balance.SelectAMonth') }}
          </option>
          <option *ngFor="let entryDate of dates" [value]="entryDate">
            {{ entryDate | entryDate | async }}
          </option>
        </select>
        <mfloww-view-button
          class="w-10 h-10 flex"
          [class.invisible]="_showNextBtn()"
          (clicked)="setNextDateAsSelected()"
        >
          <mfloww-view-icon
            type="arrow_left"
            class="-rotate-180"
          ></mfloww-view-icon>
        </mfloww-view-button>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class DateSelectorComponent implements OnInit {
  @Input({ required: true }) dates: string[] | null = null;
  @Input() set latestCreatedDate(date: string) {
    if (date) {
      this._formControl.setValue(date);
      this.handleDateChange(date);
    }
  }

  @Output() changed = new EventEmitter<string>();

  _formControl = new FormControl('', { nonNullable: true });
  _selectedIndex = signal<number>(-1);
  _showPrevBtn = computed(() => this._selectedIndex() <= 0);
  _showNextBtn = computed(
    () => this._selectedIndex() >= (this.dates?.length || 0) - 1
  );
  private _localStorage = inject(LocalStorageService);
  private _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this._formControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((date: string) => this.handleDateChange(date));
    this.setInitialDateIfExists();
  }

  handleDateChange(date: string): void {
    if (date && this.dates) {
      this._selectedIndex.set(this.dates.indexOf(date));
      this.changed.emit(date);
      this._localStorage.set(LATEST_DATE_KEY, date);
    }
  }

  setPrevDateAsSelected() {
    if (!this.dates) return;

    const currentDateIndex = this.dates.indexOf(this._formControl.value);

    if (currentDateIndex >= 1) {
      const prevDate = this.dates[currentDateIndex - 1];
      this._formControl.setValue(prevDate);
      this.handleDateChange(prevDate);
    }
  }

  setNextDateAsSelected() {
    if (!this.dates) return;

    const currentDateIndex = this.dates.indexOf(this._formControl.value);

    if (currentDateIndex < this.dates.length - 1) {
      const nextDate = this.dates[currentDateIndex + 1];
      this._formControl.setValue(nextDate);
      this.handleDateChange(nextDate);
    }
  }

  setInitialDateIfExists() {
    const initialDate = this._localStorage.get<string>(LATEST_DATE_KEY);

    if (!initialDate || !this.dates) return;

    const indexOfInitialDate = this.dates.indexOf(initialDate);

    if (indexOfInitialDate < 0) return;

    this._formControl.setValue(initialDate);
    this._selectedIndex.set(indexOfInitialDate);
  }
}
