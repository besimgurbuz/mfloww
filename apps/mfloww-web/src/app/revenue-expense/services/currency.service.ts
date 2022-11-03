import { Injectable } from '@angular/core';
import { SupportedCurrency } from '@mfloww/common';

@Injectable()
export class CurrencyService {
  getSupportedCurrencies(): SupportedCurrency[] {
    return Object.values(SupportedCurrency);
  }
}
