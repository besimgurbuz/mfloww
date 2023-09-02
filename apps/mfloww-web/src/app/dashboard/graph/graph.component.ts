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
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MflowwButtonComponent,
  MflowwIconComponent,
  MflowwTabDirective,
  MflowwTabGroupComponent,
} from '@mfloww/view';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent, ChartSeriesData } from '../chart/chart.component';
import { DashbaordFacade } from '../facades/dashboard.facade';
import { ChartType } from '../models/chart-series';
import { CalculatorService } from '../services/calculator.service';
import { ExchangeState } from '../states/exchange.state';
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
  private readonly dashboardFacade = inject(DashbaordFacade);
  private readonly calculatorService = inject(CalculatorService);
  private readonly exchangeRates = inject(ExchangeState).exchangeRates;

  _entryDates$ = this.dashboardFacade.entryDates$;
  _entryList$ = this.dashboardFacade.entryList$;
  _selectedChartType: BehaviorSubject<ChartType> =
    new BehaviorSubject<ChartType>('line');
  _selectedEntryDates = signal<string[]>([]);
  _entryList = toSignal(this.dashboardFacade.entryList$);

  _chartData = computed(() => {
    const selectedEntryDates = this._selectedEntryDates();
    const selectedEntries = this._entryList()?.filter((entry) =>
      selectedEntryDates.includes(entry.monthYear)
    );
    const exchangeRates = this.exchangeRates();

    return selectedEntries?.reduce<ChartSeriesData>(
      (chartData, entry) => {
        chartData.revenues.push({
          value: this.calculatorService.calculateTotalOfRecordsByExchangeRate(
            entry.revenues,
            exchangeRates
          ),
          date: entry.monthYear,
        });
        chartData.expenses.push({
          value: this.calculatorService.calculateTotalOfRecordsByExchangeRate(
            entry.expenses,
            exchangeRates
          ),
          date: entry.monthYear,
        });
        return chartData;
      },
      {
        expenses: [],
        revenues: [],
      }
    );
  });

  constructor() {
    effect(() => {
      console.log(this._chartData());
    });
  }

  ngOnInit(): void {
    this.dashboardFacade.loadEntryList(this.destroyRef);
  }

  setSelectedEntryDates(entryDates: string[]): void {
    this._selectedEntryDates.set(entryDates);
  }

  setSelectedChartType(type: ChartType): void {
    this._selectedChartType.next(type);
  }
}
