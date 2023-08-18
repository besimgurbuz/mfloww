import { Routes } from '@angular/router';
import { BalanceComponent } from './balance/balance.component';
import { GraphComponent } from './graph/graph.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'balance',
    pathMatch: 'full',
  },
  {
    path: 'balance',
    component: BalanceComponent,
  },
  {
    path: 'graph',
    component: GraphComponent,
  },
];
