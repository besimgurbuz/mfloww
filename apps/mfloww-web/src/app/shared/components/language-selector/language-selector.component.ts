import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@mfloww/common';
import { MflowwOverlayPanelComponent } from '@mfloww/view';

@Component({
  selector: 'mfloww-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent {
  @Input() set initialLanguage(language: SupportedLanguage | null | undefined) {
    this._selectedLang = language || 'en';
  }

  @Input() extendClassList: string[] = [];

  @Output() selection: EventEmitter<SupportedLanguage> = new EventEmitter();

  @ViewChild(MflowwOverlayPanelComponent)
  overlayPanel!: MflowwOverlayPanelComponent;

  _supportedLanguages = SUPPORTED_LANGUAGES;
  _selectedLang = 'en';

  handleLanguageSelection(language: SupportedLanguage) {
    this._selectedLang = language;
    this.selection.emit(language);
    this.overlayPanel._opened = false;
  }
}
