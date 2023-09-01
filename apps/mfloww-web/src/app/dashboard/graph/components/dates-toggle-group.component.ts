import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MflowwViewPinnedTabDirective,
  MflowwViewTabDirective,
  MflowwViewTabGroupComponent,
} from '@mfloww/view';
import { EntryDatePipe } from '../../balance/pipes/entry-date/entry-date.pipe';

@Component({
  selector: 'mfloww-dates-toggle-group',
  template: `
    <mfloww-view-tab-group class="h-full w-full">
      <ng-template mflowwViewPinnedTab>
        <button
          class="px-4 w-full h-full"
          [ngClass]="{
            'bg-mfloww_fg border-solid border-mfloww_fg-300':
              _allDatesSelected()
          }"
          (click)="_allDatesSelected.set(!_allDatesSelected())"
        >
          Select all
        </button>
      </ng-template>
      <ng-container *ngFor="let entryDate of entryDates; let last = last">
        <ng-template mflowwViewTab>
          <button
            class="border-[1px] border-solid border-mfloww_fg px-4"
            [ngClass]="{
              'rounded-r-md': last,
              'bg-mfloww_fg':
                _allDatesSelected() || _selectedEntryDates().includes(entryDate)
            }"
            (click)="toggleSelectedDate(entryDate)"
          >
            {{ entryDate | entryDate | async }}
          </button>
        </ng-template>
      </ng-container>
    </mfloww-view-tab-group>
  `,
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    AsyncPipe,
    EntryDatePipe,
    MflowwViewTabGroupComponent,
    MflowwViewPinnedTabDirective,
    MflowwViewTabDirective,
    ReactiveFormsModule,
  ],
})
export class DatesToggleGroupComponent {
  @Input()
  entryDates: string[] = [];

  @Output() changed = new EventEmitter<string[]>();

  _selectedEntryDates = signal<string[]>([]);
  _allDatesSelected = signal<boolean>(true);
  _selectAllControl = new FormControl<boolean>(true);

  toggleSelectedDate(toggledDate: string): void {
    if (this._allDatesSelected()) {
      this._allDatesSelected.set(false);
    }
    this._selectedEntryDates.mutate((selectedEntryDates) => {
      const indexOfToggledDate = selectedEntryDates.indexOf(toggledDate);

      if (indexOfToggledDate >= 0) {
        selectedEntryDates.splice(indexOfToggledDate, 1);
      } else {
        selectedEntryDates.push(toggledDate);
      }

      this.changed.emit(selectedEntryDates);
    });
  }
}
