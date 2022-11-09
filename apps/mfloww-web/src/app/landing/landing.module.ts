import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FadeDirective } from '../shared/directives/fade/fade.directive';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';

import { LandingImageComponent } from './components/landing-image/landing-image.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';

@NgModule({
  declarations: [LandingComponent, LandingImageComponent, FooterComponent],
  imports: [CommonModule, LandingRoutingModule, SharedModule, FadeDirective],
})
export class LandingModule {}
