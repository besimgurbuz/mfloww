import {
  AsyncPipe,
  KeyValuePipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MflowwButtonComponent,
  MflowwIconComponent,
  MflowwOverlayPanelComponent,
} from '@mfloww/view';
import { EntryDatePipe } from '../balance/pipes/entry-date/entry-date.pipe';
import { ChartComponent } from '../chart/chart.component';
import { BalanceFacade } from '../data-access/balance.facade';
import { CHART_TYPES_MAP, ChartSeries } from '../models/chart-series';

@Component({
  selector: 'mfloww-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    KeyValuePipe,
    AsyncPipe,
    EntryDatePipe,
    MflowwIconComponent,
    MflowwButtonComponent,
    MflowwOverlayPanelComponent,
    ChartComponent,
    ReactiveFormsModule,
  ],
})
export class GraphComponent implements OnInit {
  _chartTypeControl = new FormControl<ChartSeries['type']>('line', {
    nonNullable: true,
  });
  _chartTypesMap = CHART_TYPES_MAP;

  private destroyRef = inject(DestroyRef);
  private dashboardDataFacade = inject(BalanceFacade);

  _selectedEntryDates = signal<string[]>([]);
  _entryDates$ = this.dashboardDataFacade.entryDates$;

  ngOnInit(): void {
    this.dashboardDataFacade.loadEntryList(this.destroyRef);
  }

  toggleSelectedDate(toggledDate: string): void {
    this._selectedEntryDates.mutate((selectedEntryDates) => {
      const indexOfToggledDate = selectedEntryDates.indexOf(toggledDate);

      if (indexOfToggledDate >= 0) {
        selectedEntryDates.splice(indexOfToggledDate, 1);
      } else {
        selectedEntryDates.push(toggledDate);
      }
    });
  }
}
