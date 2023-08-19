import { Routes } from '@angular/router';
import { BalanceComponent } from './balance/balance.component';
import { BalanceDataService } from './data-access/balance-data.service';
import { BalanceFacade } from './data-access/balance.facade';
import { BalanceState } from './data-access/balance.state';
import { ExchangeFacade } from './facades/exchange.facade';
import { GraphComponent } from './graph/graph.component';
import { CalculatorService } from './services/calculator.service';
import { ExchangeService } from './services/exchange.service';
import { ExchangeState } from './states/exchange.state';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      BalanceFacade,
      BalanceDataService,
      BalanceState,
      CalculatorService,
      ExchangeFacade,
      ExchangeState,
      ExchangeService,
    ],
    children: [
      {
        path: 'balance',
        component: BalanceComponent,
      },
      {
        path: 'graph',
        component: GraphComponent,
      },
    ],
  },
];
