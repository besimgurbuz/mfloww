import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { LocalStorageToken } from './core/local-storage.token';

@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: LocalStorageToken,
      useValue: {
        setItem() {
          return null;
        },
        getItem() {
          return null;
        },
        removeItem() {
          return null;
        },
      },
    },
  ],
})
export class AppServerModule {}
