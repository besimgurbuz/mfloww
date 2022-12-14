import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mfloww-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent {
  @Input() useAsLink = true;
  @Input() link = '/';
  @Input() size: 'normal' | 'bigger' = 'normal';
}
