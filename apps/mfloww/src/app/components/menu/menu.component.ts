import { AsyncPipe, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MflowwIconComponent, MflowwOverlayPanelComponent } from '@mfloww/view';
import { TranslocoDirective } from '@ngneat/transloco';
import { ActiveUrlService } from '../../core/active-url.service';
import { AuthService } from '../../core/auth.service';
import { UserInfo } from '../../core/models/profile-info';
import { BannerComponent } from '../banner/banner.component';

@Component({
  standalone: true,
  selector: 'mfloww-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    NgIf,
    NgClass,
    NgTemplateOutlet,
    AsyncPipe,
    BannerComponent,
    MflowwOverlayPanelComponent,
    MflowwIconComponent,
    RouterLink,
    TranslocoDirective,
  ],
})
export class MenuComponent {
  @Input() profileInfo: UserInfo | null = null;

  @Output() logOutTriggered = new EventEmitter<void>();

  _isOpen = false;
  _scrollY = 0;
  _isUserLoggedIn$ = inject(AuthService).isUserLoggedIn$();

  activeUrl$ = inject(ActiveUrlService).activeUrl$();

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
