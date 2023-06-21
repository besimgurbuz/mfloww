import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MflowwDbModule } from '@mfloww/db';
import {
  MflowwOverlayPanelComponent,
  MflowwProgressBarComponent,
} from '@mfloww/view';
import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { LandingImageComponent } from './components/landing-image/landing-image.component';
import { MenuComponent } from './components/menu/menu.component';
import { CoreModule } from './core/core.module';
import { ProgressTriggererInterceptorService } from './interceptors/progress-triggerer-interceptor.service';
import { LandingComponent } from './landing/landing.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    LandingComponent,
    LandingImageComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MflowwOverlayPanelComponent,
    MflowwProgressBarComponent,
    MflowwDbModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressTriggererInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
