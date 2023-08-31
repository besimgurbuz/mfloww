import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BalanceRecordType } from '@mfloww/common';
import {
  MflowwEntryInputModule,
  MflowwMonthYearPickerComponent,
  MflowwOverlayPanelComponent,
  MflowwSelectModule,
  MonthYearSelection,
} from '@mfloww/view';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, map, tap } from 'rxjs';
import { LATEST_MONTH_YEAR_KEY } from '../../core/core.constants';
import { LocalStorageService } from '../../core/local-storage.service';
import { BalanceRecord } from '../../models/entry';
import { convertEntryDate } from '../../shared/entry-date-converter';
import { SharedModule } from '../../shared/shared.module';
import { BalanceFacade } from '../data-access/balance.facade';
import { ExchangeFacade } from '../facades/exchange.facade';
import { CalculatorService } from '../services/calculator.service';
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
  private balanceFacade = inject(BalanceFacade);
  private calculatorService = inject(CalculatorService);
  private cd = inject(ChangeDetectorRef);
  private localStorageService = inject(LocalStorageService);
  private titleService = inject(Title);
  private translateService = inject(TranslateService);

  entryDates$: Observable<string[]> = this.balanceFacade.entryDates$.pipe(
    tap(() => this.setInitialMonthYear())
  );
  hasEntry$: Observable<boolean> = this.balanceFacade.entryList$.pipe(
    map((entries) => entries && entries.length > 0)
  );
  revenues$: Observable<BalanceRecord[]> = this.balanceFacade.selectedRevenues$;
  expenses$: Observable<BalanceRecord[]> = this.balanceFacade.selectedExpenses$;
  exchangeRate$ = this.exchangeFacade.exchangeRate$;
  baseCurrency = this.exchangeFacade.baseCurrency;
  totalRevenue$: Observable<number> = this.calculatorService.totalRevenue$;
  totalExpense$: Observable<number> = this.calculatorService.totalExpense$;
  overallTotal$: Observable<number> = this.calculatorService.overallTotal$;
  entryPercentageMap$: Observable<Record<number, number>> =
    this.calculatorService.entryValuesPercentageMap$;
  selectedMonthYearIndex = -1;

  monthSelectionControl = new FormControl<string>('');

  loadEntryListSubs?: Subscription;
  monthSelectionChangeSubs?: Subscription;
  exchangeRatesUpdateSubs?: Subscription;

  ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant('Balance.Balance')
    );
    this.exchangeRatesUpdateSubs =
      this.exchangeFacade.loadExchangeRateInterval();
    this.balanceFacade.loadEntryList(this.destroyRef);
    this.setInitialMonthYear();
    this.monthSelectionChangeSubs =
      this.monthSelectionControl.valueChanges.subscribe((monthYear) => {
        if (monthYear) {
          this.selectedMonthYearIndex =
            this.balanceFacade.currentEntryDates.indexOf(monthYear);
          this.balanceFacade.setSelectedEntryByMonthYear(monthYear);
          this.cd.detectChanges();
          this.localStorageService.set(LATEST_MONTH_YEAR_KEY, monthYear);
          this.setBalanceTitle(monthYear);
        }
      });
  }

  ngOnDestroy(): void {
    this.exchangeRatesUpdateSubs?.unsubscribe();
    this.loadEntryListSubs?.unsubscribe();
    this.monthSelectionChangeSubs?.unsubscribe();
  }

  handleEntryCreation({ month, year }: MonthYearSelection) {
    const monthYear = `${month}_${year}`;
    this.balanceFacade.insertNewMonthYearEntry$(monthYear).subscribe(() => {
      this.monthSelectionControl.setValue(monthYear);
      this.selectedMonthYearIndex =
        this.balanceFacade.currentEntryDates.indexOf(monthYear);
    });
  }

  handleDeleteCurrentEntry() {
    if (this.selectedMonthYearIndex < 0) return;

    const selectedMonthYearEntry = this.monthSelectionControl.value as string;
    const [, selectedYear] = selectedMonthYearEntry.split('_');
    const confirmed = confirm(
      this.translateService.instant('Balance.EntryDeletionAlert', {
        entry: this.translateService.instant(
          convertEntryDate(selectedMonthYearEntry),
          { year: selectedYear }
        ),
      })
    );

    if (confirmed) {
      this.balanceFacade
        .deleteMonthYearEntry$(selectedMonthYearEntry)
        .subscribe(() => {
          const nextItemIndex = Math.max(this.selectedMonthYearIndex - 1, 0);
          this.selectedMonthYearIndex = nextItemIndex;
          this.monthSelectionControl.setValue(
            this.balanceFacade.currentEntryDates[nextItemIndex]
          );
        });
    }
  }

  handleRecordCreation(
    newEntry: BalanceRecord,
    type: BalanceRecordType = 'revenue'
  ) {
    this.balanceFacade.insertNewBalanceRecord(newEntry, type).subscribe();
  }

  handleRecordDeletion(index: number, type: BalanceRecordType = 'revenue') {
    this.balanceFacade.deleteBalanceRecord(index, type).subscribe();
  }

  setMonthSelection(moveStepCount: number, months: string[] | null): void {
    if (this.monthSelectionControl.value && months) {
      const movedIndex =
        months.indexOf(this.monthSelectionControl.value) + moveStepCount;

      if (movedIndex < 0 || movedIndex >= months.length) {
        return;
      }
      this.selectedMonthYearIndex = movedIndex;
      this.monthSelectionControl.setValue(months[movedIndex]);
    }
  }

  private setInitialMonthYear(): void {
    const latestMonthYear = this.localStorageService.get<string>(
      LATEST_MONTH_YEAR_KEY
    );
    const indexOfMonthYear = latestMonthYear
      ? this.balanceFacade.currentEntryDates.indexOf(latestMonthYear)
      : -1;
    if (latestMonthYear && indexOfMonthYear >= 0) {
      this.selectedMonthYearIndex = indexOfMonthYear;
      this.monthSelectionControl.setValue(latestMonthYear);
      this.balanceFacade.setSelectedEntryByMonthYear(latestMonthYear);
      this.setBalanceTitle(latestMonthYear);
    } else {
      this.monthSelectionControl.setValue(null);
    }
  }

  private setBalanceTitle(monthYear: string): void {
    const translatedDate = this.translateService.instant(
      convertEntryDate(monthYear),
      { year: monthYear.split('_')[1] }
    );
    this.titleService.setTitle(
      this.translateService.instant('Balance.BalanceDate', {
        date: translatedDate,
      })
    );
  }
}
