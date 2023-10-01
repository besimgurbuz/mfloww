import { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { shouldDisplayWhenLoggedIn } from '../../core/route-guards';
import { DashbaordFacade } from './facades/dashboard.facade';
import { ExchangeFacade } from './facades/exchange.facade';
import { CalculatorService } from './services/calculator.service';
import { DashboardDataService } from './services/dashboard-data.service';
import { ExchangeService } from './services/exchange.service';
import { DashboardState } from './states/dashboard.state';
import { ExchangeState } from './states/exchange.state';

export const routeMeta: RouteMeta = {
  title: () => `${inject(TranslocoService).translate('Graph.Title')} | mfloww`,
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
  template: 'graph',
})
export default class GraphComponent {}
