import {
  AsyncPipe,
  KeyValuePipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SupportedCurrencyCode } from '@mfloww/common';
import {
  MflowwButtonComponent,
  MflowwIconComponent,
  MflowwTabDirective,
  MflowwTabGroupComponent,
} from '@mfloww/view';
import { TranslateService } from '@ngx-translate/core';
import { translateEntryDate } from '../balance/pipes/entry-date/entry-date.pipe';
import {
  ChartComponent,
  ChartSeriesData,
  PieChartData,
} from '../chart/chart.component';
import { DashbaordFacade } from '../facades/dashboard.facade';
import { ExchangeFacade } from '../facades/exchange.facade';
import { ChartType } from '../models/chart-series';
import { CalculatorService } from '../services/calculator.service';
import { ExchangeState } from '../states/exchange.state';
import { ChartTypesToggleComponent } from './components/chart-types-toggle.component';
import { DatesSelectionGroupComponent } from './components/dates-selection-group.component';

@Component({
  standalone: true,
  selector: 'mfloww-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dashboardFacade = inject(DashbaordFacade);
  private readonly calculatorService = inject(CalculatorService);
  private readonly translateService = inject(TranslateService);
  private readonly exchangeRates = inject(ExchangeState).exchangeRates;
  readonly baseCurrency: SupportedCurrencyCode =
    inject(ExchangeFacade).baseCurrency;

  _entryDates$ = this.dashboardFacade.entryDates$;
  _entryList$ = this.dashboardFacade.entryList$;
  _selectedChartType = signal<ChartType>('line');
  _selectedEntryDates = signal<string[]>([]);
  _entryList = toSignal(this.dashboardFacade.entryList$);

  private _data = computed(() => {
    const selectedEntryDates = this._selectedEntryDates();
    const selectedEntries = this._entryList()?.filter((entry) =>
      selectedEntryDates.includes(entry.monthYear)
    );
    const exchangeRates = this.exchangeRates();

    return selectedEntries?.reduce<ChartSeriesData>(
      (chartData, entry) => {
        chartData.revenues.push(
          this.calculatorService.calculateTotalOfRecordsByExchangeRate(
            entry.revenues,
            exchangeRates
          )
        );
        chartData.expenses.push(
          this.calculatorService.calculateTotalOfRecordsByExchangeRate(
            entry.expenses,
            exchangeRates
          )
        );
        return chartData;
      },
      {
        dates: selectedEntries.map((entry) =>
          translateEntryDate(entry.monthYear, this.translateService)
        ),
        expenses: [],
        revenues: [],
      }
    );
  });

  _chartData = computed<ChartSeriesData | undefined>(() => {
    if (this._selectedChartType() === 'pie') {
      return undefined;
    }
    return this._data();
  });

  _chartPieData = computed<PieChartData | undefined>(() => {
    if (this._selectedChartType() !== 'pie') {
      return undefined;
    }
    const chartData = this._data();

    return {
      totalRevenue:
        chartData?.revenues.reduce((total, revenue) => total + revenue, 0) ?? 0,
      totalExpense:
        chartData?.expenses.reduce((total, expense) => total + expense, 0) ?? 0,
    };
  });

  ngOnInit(): void {
    this.dashboardFacade.loadEntryList(this.destroyRef);
  }

  setSelectedEntryDates(entryDates: string[]): void {
    this._selectedEntryDates.set(entryDates);
  }

  setSelectedChartType(type: ChartType): void {
    this._selectedChartType.set(type);
  }
}
