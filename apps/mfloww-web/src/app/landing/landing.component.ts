import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { SupportedLanguage } from '@mfloww/common';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../core/local-storage.service';

@Component({
  selector: 'mfloww-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements OnInit {
  private translateService = inject(TranslateService);
  private localStorageService = inject(LocalStorageService);

  _initialLanguage?: SupportedLanguage | null;

  ngOnInit(): void {
    this._initialLanguage = this.localStorageService.get('LANG');
  }

  handleLanguageChange(lang: SupportedLanguage) {
    this.translateService.use(lang);
    this.localStorageService.set('LANG', lang);
  }
}
