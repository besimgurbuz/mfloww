import { inject, Injectable } from '@angular/core';
import { ExchangeRate, SupportedCurrencyCode } from '@mfloww/common';
import { combineLatest, map, mergeMap, Observable } from 'rxjs';
import { BalanceRecord } from '../../models/entry';
import { BalanceFacade } from '../facades/balance.facade';
import { ExchangeFacade } from '../facades/exchange.facade';

@Injectable()
export class CalculatorService {
  private readonly balanceFacade = inject(BalanceFacade);
  private readonly exchangeFacade = inject(ExchangeFacade);
  private readonly sumWithExchangeReducer =
    (exchangeRate: ExchangeRate) => (total: number, entry: BalanceRecord) => {
      return total + this.exchange(entry.amount, entry.currency, exchangeRate);
    };
  private readonly absSumWithExchangeReducer =
    (exchangeRate: ExchangeRate) => (total: number, entry: BalanceRecord) => {
      return (
        total +
        Math.abs(this.exchange(entry.amount, entry.currency, exchangeRate))
      );
    };

  sumOfEntries(entries: BalanceRecord[]): number {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  }

  sumOfTotal(revenues: BalanceRecord[], expenses: BalanceRecord[]): number {
    return this.sumOfEntries(revenues) + this.sumOfEntries(expenses);
  }

  get totalRevenue$(): Observable<number> {
    return this.balanceFacade.selectedRevenues$.pipe(
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
    return this.balanceFacade.selectedExpenses$.pipe(
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
      this.balanceFacade.selectedRevenues$,
      this.balanceFacade.selectedExpenses$,
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
    currency: SupportedCurrencyCode,
    exchangeRate: ExchangeRate
  ): number {
    if (currency === this.exchangeFacade.baseCurrency) return value;

    return value / (exchangeRate.rates?.[currency] || 1);
  }
}