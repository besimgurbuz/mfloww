import { NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SupportedPlatform } from '@mfloww/common';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  standalone: true,
  imports: [NgClass, NgSwitch, NgSwitchCase, TranslocoPipe],
  selector: 'mfloww-platform-button',
  templateUrl: './platform-button.component.html',
  styleUrls: ['./platform-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformButtonComponent {
  @Input() platfrom!: SupportedPlatform;

  @Output() platformSelected = new EventEmitter<SupportedPlatform>();

  platformButtonClasses: Record<SupportedPlatform, string> = {
    GOOGLE:
      'bg-white rounded w-[280px] h-[40px] flex justify-center items-center gap-[24px] px-[12px] hover:border-[2px] hover:border-solid focus:border-[2px] focus:border-solid focus:border-[#C6DAFC] active:bg-[#ecf3fe]',
  };

  handleButtonClick(): void {
    this.platformSelected.emit(this.platfrom);
  }
}
