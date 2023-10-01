import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { MflowwOverlayPanelComponent } from '../overlay-panel/overlay-panel.component';
import { MflowwMonthYearHeaderComponent } from './components/header/header.component';

export interface MonthYearSelection {
  month: number;
  year: number;
}

const dateFilter = (date: Date) => {
  const today = new Date();
  const eightYearsBefore = new Date(today);
  eightYearsBefore.setFullYear(today.getFullYear() - 8);

  return (
    date.getTime() <= today.getTime() &&
    date.getTime() >= eightYearsBefore.getTime()
  );
};

@Component({
  selector: 'mfloww-view-month-year-picker',
  standalone: true,
  imports: [
    CommonModule,
    MflowwOverlayPanelComponent,
    MflowwMonthYearHeaderComponent,
    TranslocoDirective,
  ],
  templateUrl: './month-year-picker.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MflowwMonthYearPickerComponent {
  @Input() set value(value: MonthYearSelection) {
    if (value) {
      this._selectedMonth = value.month;
      this._selectedYear = value.year;
    }
  }
  @Output() selection: EventEmitter<MonthYearSelection> = new EventEmitter();

  _selectedYear?: number;
  _displayedYear: number = new Date().getFullYear();
  _selectedMonth = 0;
  _monthAbbreviations = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  _selectionFilter = this.getFilteredMonthSelection();
  _dateFilter = dateFilter;

  completeSelection(): void {
    if (!this._selectedYear) return;
    this.selection.emit({
      month: this._selectedMonth,
      year: this._selectedYear as number,
    });
    this.resetSelection();
  }

  resetSelection() {
    this._selectedMonth = 0;
    this._selectedYear = undefined;
  }

  changeSelection(value: number, unit: 'year' | 'month' = 'year') {
    if (unit === 'year') {
      this._displayedYear = value;
    } else {
      this._selectedMonth = value;
      this._selectedYear = this._displayedYear;
    }
    this._selectionFilter = this.getFilteredMonthSelection();
  }

  private getFilteredMonthSelection() {
    return this._monthAbbreviations.map((_, i) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setFullYear(this._displayedYear as number);
      date.setMonth(i);
      return !dateFilter(date);
    });
  }
}
