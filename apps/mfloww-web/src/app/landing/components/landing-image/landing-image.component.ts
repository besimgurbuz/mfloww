import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mfloww-landing-image',
  templateUrl: './landing-image.component.html',
  styleUrls: ['./landing-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingImageComponent {
  _imageLoaded = false;
}
