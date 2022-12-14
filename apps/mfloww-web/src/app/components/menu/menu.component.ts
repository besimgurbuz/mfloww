import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ProfileInfo } from '../../core/models/profile-info';

@Component({
  selector: 'mfloww-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @Input() profileInfo: ProfileInfo | null = null;

  @Output() logOutTriggered = new EventEmitter<void>();

  _isOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this._isOpen) {
      this._isOpen = false;
    }
  }
}
