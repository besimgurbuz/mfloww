import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'mfloww-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  _isOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this._isOpen) {
      // Click outside of element
      this._isOpen = false;
    }
  }
}
