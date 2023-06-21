import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { renderModuleFactory } from '@angular/platform-server';
export { ngExpressEngine } from '@nguniversal/express-engine';
export { AppServerModule } from './app/app.server.module';
