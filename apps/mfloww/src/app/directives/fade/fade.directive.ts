import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[mflowwFade]',
  standalone: true,
})
export class FadeDirective {
  @Input('mflowwFade') mode!: 'in' | 'out';

  @Input('mflowwFadeDelay')
  @HostBinding('style.animation-delay.ms')
  delay = 0;

  @HostBinding('class') get className() {
    return `fade-${this.mode}`;
  }
}
