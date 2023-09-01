import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MflowwPinnedTabDirective,
  MflowwTabDirective,
  MflowwTabGroupComponent,
} from '@mfloww/view';
import { EntryDatePipe } from '../../balance/pipes/entry-date/entry-date.pipe';

@Component({
  selector: 'mfloww-dates-selection-group',
  template: `
    <mfloww-view-tab-group class="h-full w-full">
      <ng-template mflowwViewPinnedTab>
        <button
          class="px-2 w-16 h-full bg-mfloww_bg hover:bg-mfloww_bg-300"
          [ngClass]="{
            'bg-mfloww_fg  hover:bg-mfloww_fg-300': _allDatesSelected()
          }"
          (click)="_allDatesSelected.set(!_allDatesSelected())"
        >
          All
        </button>
      </ng-template>
      <ng-container *ngFor="let entryDate of entryDates; let last = last">
        <ng-template mflowwViewTab>
          <button
            class="px-4 hover:bg-mfloww_bg-300 min-w-[80px]"
            [ngClass]="{
              'bg-mfloww_fg hover:bg-mfloww_fg-300':
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
    MflowwTabGroupComponent,
    MflowwPinnedTabDirective,
    MflowwTabDirective,
    ReactiveFormsModule,
  ],
})
export class DatesSelectionGroupComponent {
  @Input()
  entryDates: string[] = [];

  @Output() changed = new EventEmitter<string[]>();

  _selectedEntryDates = signal<string[]>([]);
  _allDatesSelected = signal<boolean>(false);

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
    });
    this.changed.emit(this._selectedEntryDates());
  }
}
