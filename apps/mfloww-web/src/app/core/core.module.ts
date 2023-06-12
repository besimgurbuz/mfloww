import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StatefullTranslateLoader } from './translate-loader';
import { TranslateStateService } from './translate.state';

export function HttpLoaderFactory(
  http: HttpClient,
  translateState: TranslateStateService
) {
  return new StatefullTranslateLoader(http, translateState);
}

@NgModule({
  providers: [],
  imports: [
    RouterModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, TranslateStateService],
      },
    }),
  ],
  exports: [HttpClientModule, NotFoundComponent],
  declarations: [NotFoundComponent],
})
export class CoreModule {}
