import { inject, Injectable } from '@angular/core';
import { ExchangeRate, SupportedCurrency } from '@mfloww/common';
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
      return total + this.exchange(entry.amount, entry.currency, exchangeRate);
    };
  private readonly absSumWithExchangeReducer =
    (exchangeRate: ExchangeRate) =>
    (total: number, entry: RevenueExpenseRecord) => {
      return (
        total +
        Math.abs(this.exchange(entry.amount, entry.currency, exchangeRate))
      );
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

  get entryValuesPercentageMap$(): Observable<Record<number, number>> {
    return combineLatest([
      this.revenueExpenseFacade.selectedRevenues$,
      this.revenueExpenseFacade.selectedExpenses$,
    ]).pipe(
      mergeMap(([revenues, expenses]) =>
        this.exchangeFacade.exchangeRate$.pipe(
          map((exchangeRate) => {
            const allEntries = revenues.concat(expenses);
            if (!allEntries.length) return {};
            const total = allEntries.reduce(
              this.absSumWithExchangeReducer(exchangeRate),
              0
            );

            return allEntries.reduce((percentageMap, entry) => {
              if (percentageMap[entry.amount]) return percentageMap;
              const entryValue = Math.abs(
                this.exchange(entry.amount, entry.currency, exchangeRate)
              );
              percentageMap[entry.amount] = (100 * entryValue) / total;
              return percentageMap;
            }, {} as Record<number, number>);
          })
        )
      )
    );
  }

  private exchange(
    value: number,
    currency: SupportedCurrency,
    exchangeRate: ExchangeRate
  ): number {
    if (currency === this.exchangeFacade.baseCurrency) return value;

    return value / (exchangeRate.rates?.[currency] || 1);
  }
}
