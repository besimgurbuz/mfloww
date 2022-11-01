import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MflowwProgressBarComponent } from '@mfloww/view';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { PermissionErrorHandler } from './handlers/permission-error.handler';
import { ProgressTriggererInterceptorService } from './interceptors/progress-triggerer-interceptor.service';
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
      useClass: ProgressTriggererInterceptorService,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: PermissionErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
