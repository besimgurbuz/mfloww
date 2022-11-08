import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[mflowwFade]',
  standalone: true,
})
export class FadeDirective {
  @Input('mflowwFade') mode!: 'in' | 'out';
  @HostBinding('class') get className() {
    return `fade-${this.mode}`;
  }

  @Input('mflowwFadeDelay')
  @HostBinding('style.animation-delay.ms')
  delay = 0;
}
