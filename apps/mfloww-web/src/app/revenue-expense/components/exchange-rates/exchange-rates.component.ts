import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExchangeRate } from '@mfloww/common';
import { Observable, map, timer } from 'rxjs';

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
  _displayedRate$?: Observable<[string, number] | null>;
  private _rates: [string, number][] = [];

  createDisplayedRateTimer(): void {
    this._displayedRate$ = timer(0, 5000).pipe(
      map((timerIndex: number) => {
        const currentIndex = timerIndex % this._rates.length;
        const currentRate = this._rates[currentIndex];
        return currentRate;
      })
    );
  }
}
