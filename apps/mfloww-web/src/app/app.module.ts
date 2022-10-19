import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MflowwProgressBarComponent } from '@mfloww/view';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GeneralInterceptorService } from './interceptors/general-interceptor.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MflowwProgressBarComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GeneralInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
