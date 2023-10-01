import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupportedLanguage } from '@mfloww/common';
import { TranslocoDirective } from '@ngneat/transloco';
import { BannerComponent } from '../banner/banner.component';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  standalone: true,
  selector: 'mfloww-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BannerComponent,
    LanguageSelectorComponent,
    TranslocoDirective,
    RouterLink,
  ],
})
export class FooterComponent {
  @Input() set initialLanguage(language: SupportedLanguage | null | undefined) {
    this._initialLanguage = language || 'en';
  }

  @Output() languageChanged = new EventEmitter<SupportedLanguage>();

  _initialLanguage?: SupportedLanguage;
}
