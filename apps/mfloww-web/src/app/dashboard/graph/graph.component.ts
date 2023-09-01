import { AsyncPipe, KeyValuePipe, NgClass, NgForOf } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MflowwButtonComponent, MflowwIconComponent } from '@mfloww/view';
import { ChartComponent } from '../chart/chart.component';
import { BalanceFacade } from '../data-access/balance.facade';
import { CHART_TYPES_MAP, ChartType } from '../models/chart-series';
import { DatesToggleGroupComponent } from './components/dates-toggle-group.component';

@Component({
  selector: 'mfloww-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    KeyValuePipe,
    AsyncPipe,
    MflowwIconComponent,
    MflowwButtonComponent,
    DatesToggleGroupComponent,
    ChartComponent,
  ],
})
export class GraphComponent implements OnInit {
  _selectedChartType: ChartType = 'line';
  _chartTypesMap: Record<ChartType, string> = CHART_TYPES_MAP;

  private destroyRef = inject(DestroyRef);
  private dashboardDataFacade = inject(BalanceFacade);

  _entryDates$ = this.dashboardDataFacade.entryDates$;

  ngOnInit(): void {
    this.dashboardDataFacade.loadEntryList(this.destroyRef);
  }
}
