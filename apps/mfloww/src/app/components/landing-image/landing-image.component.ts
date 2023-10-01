import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  standalone: true,
  imports: [TranslocoPipe],
  selector: 'mfloww-landing-image',
  templateUrl: './landing-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingImageComponent {}
