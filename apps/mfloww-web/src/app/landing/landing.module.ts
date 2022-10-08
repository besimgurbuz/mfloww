import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MflowwIconComponent } from '@mfloww/view';
import { LandingImageComponent } from './components/landing-image/landing-image.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';

@NgModule({
  declarations: [LandingComponent, LandingImageComponent],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule,
    MflowwIconComponent,
  ],
})
export class LandingModule {}
