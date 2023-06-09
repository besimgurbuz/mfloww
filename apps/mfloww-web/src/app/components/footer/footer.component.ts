import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SupportedLanguage } from '@mfloww/common';

@Component({
  selector: 'mfloww-footer',
  templateUrl: './footer.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input() set initialLanguage(language: SupportedLanguage | null | undefined) {
    this._initialLanguage = language || 'en';
  }

  @Output() languageChanged = new EventEmitter<SupportedLanguage>();

  _initialLanguage?: SupportedLanguage;
}
