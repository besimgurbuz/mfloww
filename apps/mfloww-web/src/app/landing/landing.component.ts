import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mfloww-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  _focusedToMenu = false;

  handleMenuFocus(isFocused: boolean) {
    this._focusedToMenu = isFocused;
  }
}
