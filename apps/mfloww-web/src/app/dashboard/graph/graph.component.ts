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
  inject,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import {
  MflowwButtonComponent,
  MflowwIconComponent,
  MflowwTabDirective,
  MflowwTabGroupComponent,
} from '@mfloww/view';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import {
  LATEST_CHART_TYPE_KEY,
  LATEST_GRAPH_DATES_KEY,
} from '../../core/core.constants';
import { LocalStorageService } from '../../core/local-storage.service';
import { MonthYearEntry } from '../../models/entry';
import { translateEntryDate } from '../balance/pipes/entry-date/entry-date.pipe';
import { ChartComponent } from '../chart/chart.component';
import { DashbaordFacade } from '../facades/dashboard.facade';
import { ExchangeFacade } from '../facades/exchange.facade';
import { ChartSeriesData } from '../models/chart-data';
import { ChartType } from '../models/chart-type';
import { CalculatorService } from '../services/calculator.service';
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
  private readonly exchangeFacade = inject(ExchangeFacade);
  private readonly localStorage = inject(LocalStorageService);

  readonly baseCurrency: SupportedCurrencyCode =
    inject(ExchangeFacade).baseCurrency;

  _entryDates$ = this.dashboardFacade.entryDates$;
  _entryList$ = this.dashboardFacade.entryList$;
  _exchangeRate$ = this.exchangeFacade.exchangeRate$;
  _selectedChartType = signal<ChartType>('line');
  _selectedEntryDates = signal<string[]>([]);
  _latestDatesSelection?: string[] = undefined;
  _latestChartType?: ChartType = undefined;

  _data$ = combineLatest([
    toObservable(this._selectedEntryDates),
    this._entryList$,
    this._exchangeRate$,
  ]).pipe(
    map(([selectedEntryDates, entries, exchangeRate]) => {
      const selectedEntries = entries.filter((entry) =>
        selectedEntryDates.includes(entry.monthYear)
      );

      return this.mapEntriesToSeries(selectedEntries, exchangeRate);
    })
  );

  ngOnInit(): void {
    this.exchangeFacade.loadExchangeRateInterval(this.destroyRef);
    this.dashboardFacade.loadEntryList(this.destroyRef);

    this.setLatestSelections();
  }

  setSelectedEntryDates(entryDates: string[]): void {
    this._selectedEntryDates.set(entryDates);
    this.localStorage.set(LATEST_GRAPH_DATES_KEY, entryDates.join(','));
  }

  setSelectedChartType(type: ChartType): void {
    this._selectedChartType.set(type);
    this.localStorage.set(LATEST_CHART_TYPE_KEY, type);
  }

  setLatestSelections() {
    this._latestChartType =
      this.localStorage.get<ChartType>(LATEST_CHART_TYPE_KEY) || undefined;
    this._latestDatesSelection = this.localStorage
      .get<string>(LATEST_GRAPH_DATES_KEY)
      ?.split(',');

    if (this._latestDatesSelection) {
      this._selectedEntryDates.set(this._latestDatesSelection);
    }

    if (this._latestChartType) {
      this._selectedChartType.set(this._latestChartType);
    }
  }

  private mapEntriesToSeries(
    entries: MonthYearEntry[],
    exchangeRate: ExchangeRate
  ) {
    return entries.reduce<ChartSeriesData>(
      (chartData, entry) => {
        chartData.revenues.push(
          this.calculatorService.calculateTotalOfRecordsByExchangeRate(
            entry.revenues,
            exchangeRate
          )
        );
        chartData.expenses.push(
          this.calculatorService.calculateTotalOfRecordsByExchangeRate(
            entry.expenses,
            exchangeRate
          )
        );
        return chartData;
      },
      {
        dates: entries.map((entry) =>
          translateEntryDate(entry.monthYear, this.translateService)
        ),
        expenses: [],
        revenues: [],
      }
    );
  }
}
