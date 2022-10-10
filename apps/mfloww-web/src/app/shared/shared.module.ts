import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MflowwIconComponent } from '@mfloww/view';
import { BannerComponent } from './components/banner/banner.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  imports: [CommonModule, MflowwIconComponent, RouterModule],
  declarations: [BannerComponent, MenuComponent],
  exports: [BannerComponent, MenuComponent, MflowwIconComponent],
})
export class SharedModule {}
