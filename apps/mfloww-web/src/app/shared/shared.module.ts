import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MflowwIconComponent, MflowwOverlayPanelComponent } from '@mfloww/view';
import { FadeDirective } from '../directives/fade/fade.directive';
import { BannerComponent } from './components/banner/banner.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    MflowwIconComponent,
    MflowwOverlayPanelComponent,
    RouterModule,
    FadeDirective,
  ],
  declarations: [BannerComponent, MenuComponent],
  exports: [BannerComponent, MenuComponent, MflowwIconComponent, FadeDirective],
})
export class SharedModule {}
