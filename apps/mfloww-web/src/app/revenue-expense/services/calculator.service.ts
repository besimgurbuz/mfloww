import { inject, Injectable } from '@angular/core';
import { ExchangeRate } from '@mfloww/common';
import { combineLatest, map, mergeMap, Observable } from 'rxjs';
import { RevenueExpenseRecord } from '../../models/entry';
import { RevenueExpenseFacade } from '../data-access/revenue-expense.facade';
import { ExchangeFacade } from '../facades/exchange.facade';

@Injectable()
export class CalculatorService {
  private readonly revenueExpenseFacade = inject(RevenueExpenseFacade);
  private readonly exchangeFacade = inject(ExchangeFacade);
  private readonly sumWithExchangeReducer =
    (exchangeRate: ExchangeRate) =>
    (total: number, entry: RevenueExpenseRecord) => {
      if (entry.currency === this.exchangeFacade.baseCurrency) {
        return total + entry.amount;
      }
      return total + entry.amount / (exchangeRate.rates?.[entry.currency] || 1);
    };

  sumOfEntries(entries: RevenueExpenseRecord[]): number {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  }

  sumOfTotal(
    revenues: RevenueExpenseRecord[],
    expenses: RevenueExpenseRecord[]
  ): number {
    return this.sumOfEntries(revenues) + this.sumOfEntries(expenses);
  }

  get totalRevenue$(): Observable<number> {
    return this.revenueExpenseFacade.selectedRevenues$.pipe(
      mergeMap((revenues) =>
        this.exchangeFacade.exchangeRate$.pipe(
          map((exchangeRate) =>
            revenues.reduce(this.sumWithExchangeReducer(exchangeRate), 0)
          )
        )
      )
    );
  }

  get totalExpense$(): Observable<number> {
    return this.revenueExpenseFacade.selectedExpenses$.pipe(
      mergeMap((expenses) =>
        this.exchangeFacade.exchangeRate$.pipe(
          map((exchangeRate) =>
            expenses.reduce(this.sumWithExchangeReducer(exchangeRate), 0)
          )
        )
      )
    );
  }

  get overallTotal$(): Observable<number> {
    return combineLatest([this.totalRevenue$, this.totalExpense$]).pipe(
      map(([totalRevenue, totalExpense]) => totalRevenue + totalExpense)
    );
  }
}
