import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { translateBrowserLoaderFactory } from './translate-browser-loader';

@NgModule({
  providers: [],
  imports: [
    RouterModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState],
      },
    }),
  ],
  exports: [NotFoundComponent],
  declarations: [NotFoundComponent],
})
export class CoreModule {}
