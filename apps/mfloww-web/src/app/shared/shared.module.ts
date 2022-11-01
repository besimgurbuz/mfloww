import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MflowwIconComponent, MflowwOverlayPanelComponent } from '@mfloww/view';
import { FadeInDirective } from '../directives/fade-in/fade-in.directive';
import { BannerComponent } from './components/banner/banner.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    MflowwIconComponent,
    MflowwOverlayPanelComponent,
    RouterModule,
    FadeInDirective,
  ],
  declarations: [BannerComponent, MenuComponent],
  exports: [BannerComponent, MenuComponent, MflowwIconComponent],
})
export class SharedModule {}
