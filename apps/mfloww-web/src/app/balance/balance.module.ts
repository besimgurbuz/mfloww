import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MflowwEntryInputModule,
  MflowwMonthYearPickerComponent,
  MflowwSelectModule,
} from '@mfloww/view';
import { SharedModule } from '../shared/shared.module';
import { BalanceComponent } from './balance.component';
import { ExchangeRatesComponent } from './components/exchange-rates/exchange-rates.component';
import { MoneyTableEntryComponent } from './components/money-table-entry/money-table-entry.component';
import { MoneyTableComponent } from './components/money-table/money-table.component';
import { OverallTableComponent } from './components/overall-panel/overall-panel.component';
import { BalanceDataService } from './data-access/balance-data.service';
import { BalanceFacade } from './data-access/balance.facade';
import { BalanceState } from './data-access/balance.state';
import { ExchangeFacade } from './facades/exchange.facade';
import { EntryDatePipe } from './pipes/entry-date/entry-date.pipe';
import { CalculatorService } from './services/calculator.service';
import { ExchangeService } from './services/exchange.service';
import { ExchangeState } from './states/exchange.state';

@NgModule({
  declarations: [
    BalanceComponent,
    MoneyTableComponent,
    MoneyTableEntryComponent,
    OverallTableComponent,
    EntryDatePipe,
    ExchangeRatesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: BalanceComponent,
      },
    ]),
    ReactiveFormsModule,
    MflowwEntryInputModule,
    MflowwSelectModule,
    MflowwMonthYearPickerComponent,
  ],
  providers: [
    BalanceDataService,
    BalanceState,
    BalanceFacade,
    CalculatorService,
    ExchangeFacade,
    ExchangeState,
    ExchangeService,
  ],
})
export class BalanceModule {}
