import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BalanceRecordType } from '@mfloww/common';
import {
  MflowwEntryInputComponent,
  MflowwIconComponent,
  MflowwMonthYearPickerComponent,
  MflowwOverlayPanelComponent,
  MflowwSelectComponent,
  MonthYearSelection,
} from '@mfloww/view';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, Subscription, map } from 'rxjs';
import { shouldDisplayWhenLoggedIn } from '../../core/route-guards';
import { convertEntryDate } from '../../helpers/entry-date-converter';
import { DateSelectorComponent } from './components/date-selector.component';
import { ExchangeRatesComponent } from './components/exchange-rates/exchange-rates.component';
import { MoneyTableComponent } from './components/money-table/money-table.component';
import { OverallComponent } from './components/overall-panel/overall-panel.component';
import { DashbaordFacade } from './facades/dashboard.facade';
import { ExchangeFacade } from './facades/exchange.facade';
import { BalanceRecord } from './models/entry';
import { EntryDatePipe } from './pipes/entry-date/entry-date.pipe';
import { CalculatorService } from './services/calculator.service';
import { DashboardDataService } from './services/dashboard-data.service';
import { ExchangeService } from './services/exchange.service';
import { DashboardState } from './states/dashboard.state';
import { ExchangeState } from './states/exchange.state';

export const routeMeta: RouteMeta = {
  title: () =>
    `${inject(TranslocoService).translate('Balance.Title')} | mfloww`,
  canActivate: [shouldDisplayWhenLoggedIn],
  providers: [
    DashbaordFacade,
    DashboardDataService,
    DashboardState,
    CalculatorService,
    ExchangeFacade,
    ExchangeState,
    ExchangeService,
  ],
};

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    DateSelectorComponent,
    ExchangeRatesComponent,
    MoneyTableComponent,
    OverallComponent,
    EntryDatePipe,
    MflowwIconComponent,
    MflowwEntryInputComponent,
    MflowwSelectComponent,
    MflowwOverlayPanelComponent,
    MflowwMonthYearPickerComponent,
  ],
  templateUrl: './balance.page.html',
})
export default class BalanceComponent {
  private destroyRef = inject(DestroyRef);
  private exchangeFacade = inject(ExchangeFacade);
  private dashboardFacade = inject(DashbaordFacade);
  private calculatorService = inject(CalculatorService);
  private translateService = inject(TranslocoService);

  entryDates$: Observable<string[]> = this.dashboardFacade.entryDates$;
  hasEntry$: Observable<boolean> = this.dashboardFacade.entryList$.pipe(
    map((entries) => entries && entries.length > 0)
  );
  revenues$: Observable<BalanceRecord[]> =
    this.dashboardFacade.selectedRevenues$;
  expenses$: Observable<BalanceRecord[]> =
    this.dashboardFacade.selectedExpenses$;
  exchangeRate$ = this.exchangeFacade.exchangeRate$;
  baseCurrency = this.exchangeFacade.baseCurrency;
  totalRevenue$: Observable<number> = this.calculatorService.totalRevenue$;
  totalExpense$: Observable<number> = this.calculatorService.totalExpense$;
  overallTotal$: Observable<number> = this.calculatorService.overallTotal$;
  entryPercentageMap$: Observable<Record<number, number>> =
    this.calculatorService.entryValuesPercentageMap$;
  selectedDate: string | null = null;
  _latestCreatedEntryDate!: string;

  loadEntryListSubs?: Subscription;
  exchangeRatesUpdateSubs?: Subscription;

  ngOnInit(): void {
    this.exchangeFacade.loadExchangeRateInterval(this.destroyRef);
    this.dashboardFacade.loadEntryList(this.destroyRef);
  }

  ngOnDestroy(): void {
    this.exchangeRatesUpdateSubs?.unsubscribe();
    this.loadEntryListSubs?.unsubscribe();
  }

  handleDateSelection(date: string) {
    this.selectedDate = date;
    this.dashboardFacade.setSelectedEntryByMonthYear(date);
  }

  handleEntryCreation({ month, year }: MonthYearSelection) {
    const monthYear = `${month}_${year}`;
    this.dashboardFacade.insertNewMonthYearEntry$(monthYear).subscribe(() => {
      this.selectedDate = monthYear;
    });
    this._latestCreatedEntryDate = monthYear;
  }

  handleDeleteCurrentEntry() {
    if (!this.selectedDate) return;

    const [, selectedYear] = this.selectedDate.split('_');
    const confirmed = confirm(
      this.translateService.translate('Balance.EntryDeletionAlert', {
        entry: this.translateService.translate(
          convertEntryDate(this.selectedDate),
          { year: selectedYear }
        ),
      })
    );

    if (confirmed) {
      this.dashboardFacade.deleteMonthYearEntry$(this.selectedDate).subscribe();
    }
  }

  handleRecordCreation(
    newEntry: BalanceRecord,
    type: BalanceRecordType = 'revenue'
  ) {
    this.dashboardFacade.insertNewBalanceRecord(newEntry, type).subscribe();
  }

  handleRecordDeletion(index: number, type: BalanceRecordType = 'revenue') {
    this.dashboardFacade.deleteBalanceRecord(index, type).subscribe();
  }
}
