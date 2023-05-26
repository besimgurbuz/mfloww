import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  MflowwButtonComponent,
  MflowwIconComponent,
  MflowwOverlayPanelComponent,
} from '@mfloww/view';
import { TranslateModule } from '@ngx-translate/core';
import { BannerComponent } from './components/banner/banner.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { FadeDirective } from './directives/fade/fade.directive';

@NgModule({
  imports: [
    CommonModule,
    MflowwIconComponent,
    MflowwOverlayPanelComponent,
    MflowwButtonComponent,
    RouterModule,
    FadeDirective,
  ],
  declarations: [BannerComponent, LanguageSelectorComponent],
  exports: [
    BannerComponent,
    MflowwIconComponent,
    MflowwButtonComponent,
    FadeDirective,
    TranslateModule,
    LanguageSelectorComponent,
  ],
})
export class SharedModule {}
