import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExchangeRate } from '@mfloww/common';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  timer,
} from 'rxjs';

@Component({
  selector: 'mfloww-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeRatesComponent {
  @Input() set exchangeRate(rate: ExchangeRate | null) {
    this._exchangeRate = rate;
    if (rate && rate.rates) {
      this._rates = Object.entries(rate.rates);
      this.createDisplayedRateTimer();
    }
  }
  get exchangeRate() {
    return this._exchangeRate;
  }
  _exchangeRate: ExchangeRate | null = null;
  _clicked$ = new BehaviorSubject<null>(null);
  _currentIndex = 0;
  _displayedRate$?: Observable<[string, number] | null>;
  _hovered = false;
  private _rates: [string, number][] = [];

  createDisplayedRateTimer(): void {
    this._displayedRate$ = combineLatest([
      timer(0, 5000).pipe(filter(() => !this._hovered)),
      this._clicked$,
    ]).pipe(
      map(() => {
        const currentIndex = (this._currentIndex + 1) % this._rates.length;
        const currentRate = this._rates[currentIndex];
        this._currentIndex++;
        return currentRate;
      })
    );
  }

  handleClick() {
    this._currentIndex++;
    this._clicked$.next(null);
  }
}
