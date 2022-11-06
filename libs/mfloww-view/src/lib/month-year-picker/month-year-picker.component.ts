import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { MflowwOverlayPanelComponent } from '../overlay-panel/overlay-panel.component';
import { MflowwMonthYearHeaderComponent } from './components/header/header.component';

export interface MonthYearSelection {
  month: number;
  year: number;
}

@Component({
  selector: 'mfloww-view-month-year-picker',
  standalone: true,
  imports: [
    CommonModule,
    MflowwOverlayPanelComponent,
    MflowwMonthYearHeaderComponent,
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
  @Output() selection: EventEmitter<MonthYearSelection> = new EventEmitter();

  _selectedYear!: number;
  _selectedMonth = 0;
  _monthAbbreviations = [
    'Jan',
    'Feb',
    'Apr',
    'Mar',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  completeSelection(): void {
    this.selection.emit({
      month: this._selectedMonth,
      year: this._selectedYear,
    });
    this.resetSelection();
  }

  resetSelection() {
    this._selectedMonth = 0;
    this._selectedYear = new Date().getFullYear();
  }
}
