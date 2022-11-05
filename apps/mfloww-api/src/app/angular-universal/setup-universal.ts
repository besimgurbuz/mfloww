import { Logger } from '@nestjs/common';
import { CacheKeyByOriginalUrlGenerator } from '@nestjs/ng-universal/dist/cache/cahce-key-by-original-url.generator';
import { InMemoryCacheStorage } from '@nestjs/ng-universal/dist/cache/in-memory-cache.storage';
import { CacheKeyGenerator } from '@nestjs/ng-universal/dist/interfaces/cache-key-generator.interface';
import { CacheStorage } from '@nestjs/ng-universal/dist/interfaces/cache-storage.interface';
import * as express from 'express';
import { Express, Request } from 'express';

import { AngularUniversalOptions } from './interfaces/angular-universal-options.interface';

const DEFAULT_CACHE_EXPIRATION_TIME = 60000; // 60 seconds

const logger = new Logger('AngularUniversalModule');

export function setupUniversal(
  app: Express,
  ngOptions: AngularUniversalOptions
) {
  const cacheOptions = getCacheOptions(ngOptions);

  app.engine('html', (_, opts, callback) => {
    const options = opts as unknown as Record<string, unknown>;
    let cacheKey: string | undefined;
    if (cacheOptions.isEnabled) {
      const cacheKeyGenerator = cacheOptions.keyGenerator;
      cacheKey = cacheKeyGenerator.generateCacheKey(options['req']);

      const cacheHtml = cacheOptions.storage.get(cacheKey);
      if (cacheHtml) {
        return callback(null, cacheHtml);
      }
    }

    ngOptions.ngExpressEngine({
      bootstrap: ngOptions.bootstrap,
      inlineCriticalCss: ngOptions.inlineCriticalCss,
      providers: [
        {
          provide: 'serverUrl',
          useValue: `${(options['req'] as Request).protocol}://${(
            options['req'] as Request
          ).get('host')}`,
        },
        ...(ngOptions.extraProviders || []),
      ],
    })(_, options, (err, html) => {
      if (err && ngOptions.errorHandler) {
        return ngOptions.errorHandler({
          err,
          html,
          renderCallback: callback,
        });
      }

      if (err) {
        logger.error(err);

        return callback(err);
      }

      if (cacheOptions.isEnabled && cacheKey) {
        cacheOptions.storage.set(cacheKey, html ?? '', cacheOptions.expiresIn);
      }

      callback(null, html);
    });
  });

  app.set('view engine', 'html');
  app.set('views', ngOptions.viewsPath);

  // Serve static files
  app.get(
    ngOptions.rootStaticPath ?? '*.*',
    express.static(ngOptions.viewsPath, {
      maxAge: 600,
    })
  );
}

type CacheOptions =
  | { isEnabled: false }
  | {
      isEnabled: true;
      storage: CacheStorage;
      expiresIn: number;
      keyGenerator: CacheKeyGenerator;
    };

export function getCacheOptions(
  ngOptions: AngularUniversalOptions
): CacheOptions {
  if (!ngOptions.cache) {
    return {
      isEnabled: false,
    };
  }

  if (typeof ngOptions.cache !== 'object') {
    return {
      isEnabled: true,
      storage: new InMemoryCacheStorage(),
      expiresIn: DEFAULT_CACHE_EXPIRATION_TIME,
      keyGenerator: new CacheKeyByOriginalUrlGenerator(),
    };
  }

  return {
    isEnabled: true,
    storage: ngOptions.cache.storage || new InMemoryCacheStorage(),
    expiresIn: ngOptions.cache.expiresIn || DEFAULT_CACHE_EXPIRATION_TIME,
    keyGenerator:
      ngOptions.cache.keyGenerator || new CacheKeyByOriginalUrlGenerator(),
  };
}
