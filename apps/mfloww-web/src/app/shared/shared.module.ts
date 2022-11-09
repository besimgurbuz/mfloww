import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MflowwIconComponent, MflowwOverlayPanelComponent } from '@mfloww/view';
import { BannerComponent } from './components/banner/banner.component';
import { FadeDirective } from './directives/fade/fade.directive';

@NgModule({
  imports: [
    CommonModule,
    MflowwIconComponent,
    MflowwOverlayPanelComponent,
    RouterModule,
    FadeDirective,
  ],
  declarations: [BannerComponent],
  exports: [BannerComponent, MflowwIconComponent, FadeDirective],
})
export class SharedModule {}
