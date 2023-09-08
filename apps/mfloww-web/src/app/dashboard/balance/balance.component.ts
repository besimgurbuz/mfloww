import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BalanceRecordType } from '@mfloww/common';
import {
  MflowwEntryInputModule,
  MflowwMonthYearPickerComponent,
  MflowwOverlayPanelComponent,
  MflowwSelectModule,
  MonthYearSelection,
} from '@mfloww/view';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, map } from 'rxjs';
import { BalanceRecord } from '../../models/entry';
import { convertEntryDate } from '../../shared/entry-date-converter';
import { SharedModule } from '../../shared/shared.module';
import { DashbaordFacade } from '../facades/dashboard.facade';
import { ExchangeFacade } from '../facades/exchange.facade';
import { CalculatorService } from '../services/calculator.service';
import { DateSelectorComponent } from './components/date-selector.component';
import { ExchangeRatesComponent } from './components/exchange-rates/exchange-rates.component';
import { MoneyTableComponent } from './components/money-table/money-table.component';
import { OverallComponent } from './components/overall-panel/overall-panel.component';
import { EntryDatePipe } from './pipes/entry-date/entry-date.pipe';

@Component({
  selector: 'mfloww-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    SharedModule,
    ReactiveFormsModule,
    DateSelectorComponent,
    ExchangeRatesComponent,
    MoneyTableComponent,
    OverallComponent,
    EntryDatePipe,
    MflowwEntryInputModule,
    MflowwSelectModule,
    MflowwOverlayPanelComponent,
    MflowwMonthYearPickerComponent,
  ],
})
export class BalanceComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private exchangeFacade = inject(ExchangeFacade);
  private dashboardFacade = inject(DashbaordFacade);
  private calculatorService = inject(CalculatorService);
  private translateService = inject(TranslateService);

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
      this.translateService.instant('Balance.EntryDeletionAlert', {
        entry: this.translateService.instant(
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
