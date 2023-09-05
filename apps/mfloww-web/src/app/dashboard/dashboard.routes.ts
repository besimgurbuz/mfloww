import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { BalanceComponent } from './balance/balance.component';
import { DashboardDataService } from './data-access/dashboard-data.service';
import { DashboardState } from './data-access/dashboard.state';
import { DashbaordFacade } from './facades/dashboard.facade';
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
      DashbaordFacade,
      DashboardDataService,
      DashboardState,
      CalculatorService,
      ExchangeFacade,
      ExchangeState,
      ExchangeService,
    ],
    children: [
      {
        path: 'balance',
        component: BalanceComponent,
        title: () =>
          inject(TranslateService)
            .get('Balance.Title')
            .pipe(map((title) => `${title} | mfloww`)),
      },
      {
        path: 'graph',
        component: GraphComponent,
        title: () =>
          inject(TranslateService)
            .get('Graph.Title')
            .pipe(map((title) => `${title} | mfloww`)),
      },
    ],
  },
];
