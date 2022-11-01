import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[mflowwFadeIn]',
  standalone: true,
})
export class FadeInDirective {
  @HostBinding('class') class = 'fade-in';
  @Input('mflowwFadeInDelay')
  @HostBinding('style.animation-delay.ms')
  delay = 0;
}
