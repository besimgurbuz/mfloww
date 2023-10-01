import { KeyValuePipe, NgClass, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@mfloww/common';
import { MflowwOverlayPanelComponent } from '@mfloww/view';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';
import { FlagIconComponent } from '../flag-icon/flag-icon.component';

@Component({
  standalone: true,
  selector: 'mfloww-language-selector',
  template: `
    <mfloww-view-overlay-panel class="text-xl">
      <button
        mflowwOverlayTriggerer
        class="focus:bg-mfloww_fg_hover hover:bg-mfloww_fg_hover rounded p-2"
        [ngClass]="extendClassList"
      >
        <mfloww-flag-icon [flagCode]="$any(_selectedLang)"></mfloww-flag-icon>
      </button>
      <div
        mflowwPanelContent
        class="flex flex-row flex-wrap w-28 overflow-hidden"
      >
        <button
          *ngFor="let language of _supportedLanguages | keyvalue"
          class="w-9 p-2 hover:bg-mfloww_fg_hover grow"
          (click)="handleLanguageSelection($any(language.key))"
        >
          <mfloww-flag-icon [flagCode]="$any(language.key)"></mfloww-flag-icon>
        </button>
      </div>
    </mfloww-view-overlay-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgForOf,
    KeyValuePipe,
    MflowwOverlayPanelComponent,
    FlagIconComponent,
  ],
})
export class LanguageSelectorComponent {
  @Input() set initialLanguage(language: SupportedLanguage | null | undefined) {
    this._selectedLang = language || 'en';
  }
  @Input() extendClassList: string[] = [];

  @Output() selection: EventEmitter<SupportedLanguage> = new EventEmitter();

  @ViewChild(MflowwOverlayPanelComponent)
  overlayPanel!: MflowwOverlayPanelComponent;

  _translateService = inject(TranslocoService);
  _destroyRef = inject(DestroyRef);
  _supportedLanguages = SUPPORTED_LANGUAGES;
  _selectedLang = 'en';

  handleLanguageSelection(language: SupportedLanguage) {
    this._selectedLang = language;
    this._translateService
      .load(language)
      .pipe(take(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._translateService.setActiveLang(language);
      });
    this.selection.emit(language);
    this.overlayPanel._opened = false;
  }
}
