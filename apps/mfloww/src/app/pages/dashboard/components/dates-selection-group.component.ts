import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MflowwPinnedTabDirective,
  MflowwTabDirective,
  MflowwTabGroupComponent,
} from '@mfloww/view';
import { TranslocoPipe } from '@ngneat/transloco';
import { EntryDatePipe } from '../pipes/entry-date/entry-date.pipe';

@Component({
  selector: 'mfloww-dates-selection-group',
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
    TranslocoPipe,
  ],
  template: `
    <mfloww-view-tab-group class="h-full w-full">
      <ng-template mflowwViewPinnedTab>
        <button
          class="px-2 w-16 h-full bg-mfloww_bg hover:bg-mfloww_bg-300"
          [ngClass]="{
            'bg-mfloww_fg  hover:bg-mfloww_fg-300': _allDatesSelected()
          }"
          (click)="toggleAll()"
        >
          {{ 'Graph.All' | transloco }}
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
})
export class DatesSelectionGroupComponent {
  @Input({ required: true })
  entryDates: string[] = [];

  @Input() set initialValue(selection: string[] | undefined) {
    if (selection && selection.length) {
      this._allDatesSelected.set(selection.length === this.entryDates.length);
      this._selectedEntryDates.set(selection);
      this.changed.emit(selection);
    }
  }

  @Output() changed = new EventEmitter<string[]>();

  _selectedEntryDates = signal<string[]>([]);
  _allDatesSelected = signal<boolean>(false);

  toggleAll(): void {
    const toggled = !this._allDatesSelected();
    this._allDatesSelected.set(toggled);
    const toggledDates = toggled ? [...this.entryDates] : [];

    this.changed.emit(toggledDates);
    this._selectedEntryDates.set(toggledDates);
  }

  toggleSelectedDate(toggledDate: string): void {
    const updatedSelection = [...this._selectedEntryDates()];
    const indexOfToggledDate = updatedSelection.indexOf(toggledDate);

    if (indexOfToggledDate >= 0) {
      updatedSelection.splice(indexOfToggledDate, 1);
    } else {
      updatedSelection.push(toggledDate);
    }
    const isReacedMaxSelection =
      updatedSelection.length === this.entryDates.length;

    if (isReacedMaxSelection) {
      this._allDatesSelected.set(true);
    } else if (this._allDatesSelected()) {
      this._allDatesSelected.set(false);
    }
    this._selectedEntryDates.set(updatedSelection);
    this.changed.emit(updatedSelection);
  }
}
