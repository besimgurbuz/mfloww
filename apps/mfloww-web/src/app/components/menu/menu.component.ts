import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { ActiveUrlService } from '../../core/active-url.service';
import { ProfileInfo } from '../../core/models/profile-info';

@Component({
  selector: 'mfloww-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @Input() profileInfo: ProfileInfo | null = null;
  activeUrl$ = inject(ActiveUrlService).activeUrl$();

  @Output() logOutTriggered = new EventEmitter<void>();

  _isOpen = false;
  _scrollY = 0;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:scroll')
  scrolled() {
    this._scrollY = window.scrollY;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this._isOpen) {
      this._isOpen = false;
    }
  }
}
