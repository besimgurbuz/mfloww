import {
  AsyncPipe,
  KeyValuePipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  MflowwButtonComponent,
  MflowwIconComponent,
  MflowwTabDirective,
  MflowwTabGroupComponent,
} from '@mfloww/view';
import { ChartComponent } from '../chart/chart.component';
import { BalanceFacade } from '../facades/balance.facade';
import { ChartType } from '../models/chart-series';
import { ChartTypesToggleComponent } from './components/chart-types-toggle.component';
import { DatesSelectionGroupComponent } from './components/dates-selection-group.component';

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
    MflowwIconComponent,
    MflowwButtonComponent,
    MflowwTabGroupComponent,
    MflowwTabDirective,
    DatesSelectionGroupComponent,
    ChartTypesToggleComponent,
    ChartComponent,
  ],
})
export class GraphComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dashboardDataFacade = inject(BalanceFacade);

  _entryDates$ = this.dashboardDataFacade.entryDates$;
  _selectedChartType: ChartType = 'line';
  _selectedEntryDates = signal<string[]>([]);

  constructor() {
    effect(() => {
      const selectedEntryDates = this._selectedEntryDates();

      console.log(selectedEntryDates);
    });
  }

  ngOnInit(): void {
    this.dashboardDataFacade.loadEntryList(this.destroyRef);
  }

  setSelectedEntryDates(entryDates: string[]): void {
    this._selectedEntryDates.set(entryDates);
  }
}
