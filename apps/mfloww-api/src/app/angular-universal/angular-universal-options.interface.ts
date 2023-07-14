import { AngularUniversalOptions as BaseOptions } from '@nestjs/ng-universal';
import { ngExpressEngine } from '@nguniversal/express-engine';

export interface AngularUniversalOptions extends BaseOptions {
  ngExpressEngine: typeof ngExpressEngine;
}
