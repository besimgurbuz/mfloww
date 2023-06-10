import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '@mfloww/view';

@Component({
  selector: 'mfloww-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  features: { icon: Icon; textIndex: number }[] = [
    { icon: 'lock', textIndex: 1 },
    { icon: 'currency_exchange', textIndex: 2 },
    { icon: 'graph', textIndex: 3 },
    { icon: 'code', textIndex: 4 },
  ];
}
