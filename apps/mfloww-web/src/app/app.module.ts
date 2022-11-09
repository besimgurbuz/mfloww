import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MflowwDbModule } from '@mfloww/db';
import {
  MflowwOverlayPanelComponent,
  MflowwProgressBarComponent,
} from '@mfloww/view';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { CoreModule } from './core/core.module';
import { PermissionErrorHandler } from './handlers/permission-error.handler';
import { ProgressTriggererInterceptorService } from './interceptors/progress-triggerer-interceptor.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, MenuComponent, FooterComponent],
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
