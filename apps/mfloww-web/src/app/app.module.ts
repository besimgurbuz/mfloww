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
import { MenuComponent } from './components/menu/menu.component';
import { SplashComponent } from './components/splash/splash.component';
import { CoreModule } from './core/core.module';
import { ProgressTriggererInterceptorService } from './interceptors/progress-triggerer-interceptor.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, MenuComponent, FooterComponent, SplashComponent],
  imports: [
    CoreModule,
    BrowserModule.withServerTransition({
      appId: 'mfloww',
    }),
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
