import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'mfloww-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @Output() focused: EventEmitter<boolean> = new EventEmitter();

  _isOpen = false;

  handleButtonClick() {
    this._isOpen = !this._isOpen;
    this.focused.emit(this._isOpen);
  }
}
