import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Icon } from '@mfloww/view';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../core/local-storage.service';

@Component({
  selector: 'mfloww-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private translateService = inject(TranslateService);
  private localStorageService = inject(LocalStorageService);

  features: { icon: Icon; textIndex: number }[] = [
    { icon: 'lock', textIndex: 1 },
    { icon: 'currency_exchange', textIndex: 2 },
    { icon: 'graph', textIndex: 3 },
    { icon: 'code', textIndex: 4 },
  ];
}
